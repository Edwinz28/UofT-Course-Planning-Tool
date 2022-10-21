# this is the flask core
import os
import json
import pandas as pd

import pickle
from flask import Flask, send_from_directory, jsonify, request
from flask_restful import Api,Resource, reqparse

df = pd.read_csv("resources/courses.csv")
df_certificate = pd.read_csv("resources/course_certificate.csv")
df_hss = pd.read_csv("resources/hss_data.csv")
df_cs = pd.read_csv("resources/cs_data.csv")

with open('resources/user_reviews.json') as json_file:
    course_reviews_dict = json.load(json_file)

import config
app = Flask(__name__, static_folder='frontend/build')
app.config['ENV'] = 'development'
app.config['DEBUG'] = True
app.config['TESTING'] = True
# MongoDB URI
# DB_URI = "mongodb+srv://Cansin:cv190499@a-star.roe6s.mongodb.net/A-Star?retryWrites=true&w=majority"
# app.config["MONGODB_HOST"] = DB_URI

config.init_app(app)
config.init_db(app)
config.init_cors(app)


# route functions
def search_course_by_code(s):
    # return all the courses whose course code contains the str s
    course_ids = df[df['Code'].str.contains(s.upper())].index.tolist()
    if len(course_ids) == 0:
        return []
    if len(course_ids) > 10:
        course_ids = course_ids[:10]
    res = []
    for i, course_id in enumerate(course_ids):
        d = df.iloc[course_id].to_dict()
        d_certificate = df_certificate.loc[df_certificate['Code'] == d['Code']]
        res_d = {
            '_id': i,
            'code': d['Code'],
            'name': d['Name'],
            # 'certificate': d['Certificate'],
            'certificate': d_certificate['Certificate'].item(),
            'description': "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.",
            'syllabus': "Course syllabus here.",
            'prereq': ['APS101H1, ECE101H1'],
            'coreq': ['APS102H1, ECE102H1'],
            'exclusion': ['APS102H1, ECE102H1'] ,
        }
        res.append(res_d)
    return res

class UserReviews(Resource):
    def __update_json(self):
        with open("resources/user_reviews.json", "w") as write_file:
            json.dump(course_reviews_dict, write_file, indent=4)

    def get(self):
        course_code = request.args.get('course_code')
        reviews = course_reviews_dict.get(course_code, None)
        if reviews:
            try:
                resp = jsonify(reviews)
                resp.status_code = 200
                return resp
            except Exception as e:
                resp = jsonify({'error': str(e)})
                resp.status_code = 400
                return resp
        else:
            resp = jsonify({'error': f"No entry for the queries course code {course_code}"})
            resp.status_code = 400
            return resp
    
    def post(self):
        user_name = request.args.get('user_name')
        review = request.args.get('review')
        course_code = request.args.get('course_code')
        if user_name is None:
            resp = jsonify({'error': f"Key 'user_name' not specified"})
            resp.status_code = 400
            return resp    
        elif review is None:
            resp = jsonify({'error': f"Key 'review' not specified"})
            resp.status_code = 400
            return resp          
        elif course_reviews_dict.get(course_code, None):
            course_reviews_dict[course_code].append({"name": user_name, 
                                                     "review": review})
            self.__update_json()
            resp = jsonify({'result': f'User review added to {course_code}'})
            resp.status_code = 200
            return resp
        else:
            resp = jsonify({'error': f'Course code does not exist {course_code}'})
            resp.status_code = 400
            return resp            
            

class HssEligibility(Resource):
    def __is_course_hss(self, course_code):
        course_set = set(df_hss["colummn"])
        return course_code in course_set

    def get(self):
        input = request.args.get('input')
        res = self.__is_course_hss(input)
        try:
            resp = jsonify(res)
            resp.status_code = 200
            return resp
        except Exception as e:
            resp = jsonify({'error': str(e)})
            resp.status_code = 400
            return resp

class CsEligibility(Resource):
    def __is_course_cs(self, course_code):
        courses = set(df_cs["colummn"])
        for course in courses:
            if course in course_code:
                return True
        return False

    def get(self):
        input = request.args.get('input')
        res = self.__is_course_cs(input)
        try:
            resp = jsonify(res)
            resp.status_code = 200
            return resp
        except Exception as e:
            resp = jsonify({'error': str(e)})
            resp.status_code = 400
            return resp

class SearchCourse(Resource):
    def get(self):
        input = request.args.get('input')
        courses = search_course_by_code(input)
        if len(courses) > 0:
            try:
                resp = jsonify(courses)
                resp.status_code = 200
                return resp
            except Exception as e:
                resp = jsonify({'error': str(e)})
                resp.status_code = 400
                return resp

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('input', required=True)
        data = parser.parse_args()
        input = data['input']
        courses = search_course_by_code(input)
        if len(courses) > 0:
            try:
                resp = jsonify(courses)
                resp.status_code = 200
                return resp
            except Exception as e:
                resp = jsonify({'error': 'something went wrong'})
                resp.status_code = 400
                return resp

class ShowCourse(Resource):
    def get(self):
        code = request.args.get('code')
        courses = search_course_by_code(code)
        # print(courses, flush = True)
        if len(courses) == 0:
            resp = jsonify({'message': f"Course {code} doesn't exist"})
            resp.status_code = 404
            return resp
        try:
            resp = jsonify({'course': courses[0]})
            resp.status_code = 200
            return resp
        except Exception as e:
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp
    
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('code', required=True)
        data = parser.parse_args()
        code = data['code']
        courses = search_course_by_code(code)
        if len(courses) == 0:
            resp = jsonify({'message': f"Course {code} doesn't exist"})
            resp.status_code = 404
            return resp
        try:
            resp = jsonify({'course': courses[0]})
            resp.status_code = 200
            return resp
        except Exception as e:
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp

# API Endpoints
rest_api = Api(app)
# rest_api.add_resource(controller.SearchCourse, '/searchc')
rest_api.add_resource(SearchCourse, '/searchc')
# rest_api.add_resource(controller.ShowCourse, '/course/details')
rest_api.add_resource(ShowCourse, '/course/details')
rest_api.add_resource(UserReviews, '/course/reviews')
rest_api.add_resource(HssEligibility, '/check/hss')
rest_api.add_resource(CsEligibility, '/check/cs')

@app.route("/", defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')



if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=5050, extra_files=['app.py', 'controller.py', 'model.py'])
    app.run(threaded=True, port=5050)
    # with open("test.json") as f:
    #     data = json.load(f)
    # for i in range(75):
    #     i = str(i)
    #     Course(name=data["name"][i], code=data["code"][i], description=data["description"][i], prereq=data["prereq"][i], coreq=data["coreq"][i], exclusion=data["exclusion"][i]).save()

    
    
