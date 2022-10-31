# this is the flask core
import os
import json
import pandas as pd

import pickle
from flask import Flask, send_from_directory, jsonify, request
from flask_restful import Api,Resource, reqparse

df = pd.read_csv("resources/courses.csv")
# df_certificate = pd.read_csv("resources/course_certificate.csv")
df_hss = pd.read_csv("resources/hss_data.csv")
df_cs = pd.read_csv("resources/cs_data.csv")
df_cs_exceptions = pd.read_csv("resources/cs_exceptions_data.csv")

with open('resources/user_reviews.json') as json_file:
    course_reviews_dict = json.load(json_file)
with open('resources/user_ratings.json') as json_file:
    course_ratings_dict = json.load(json_file)

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
    def parse_courses(courses):
        # Parses "['mycourse1', 'mycourse2'...]"" from .csv into "mycourse1, mycourse2"
        char_filter = "'[]"
        return ''.join(c for c in courses if c not in char_filter)

    for i, course_id in enumerate(course_ids):
        d = df.iloc[course_id].to_dict()
        res_d = {
            '_id': i,
            'code': d['Code'],
            'name': d['Name'],
            'certificate': d['Certificate'],
            'division': d['Division'],
            'department': d['Department'],
            'description': d['Course Description'],
            'prereq': parse_courses(d['Pre-requisites']),
            'coreq': parse_courses(d['Corequisite']),
            'exclusion': parse_courses(d['Exclusion']),
        }

        res.append(res_d)
    return res

class UserRatings(Resource):
    def __update_json(self):
        with open("resources/user_ratings.json", "w") as write_file:
            json.dump(course_ratings_dict, write_file, indent=4)
    
    def reset_rating(self, course_code):
        course_ratings_dict[course_code]["average_rating"] = {}
        self.__update_json()
        
    def get(self):
        course_code = request.args.get('course_code')
        rating_details = course_ratings_dict.get(course_code, None)
        if rating_details is None:
            resp = jsonify({'error': f"No entry for the queried course code {course_code}"})
            resp.status_code = 400
            return resp

        if rating_details.get("average_rating", None) is None:
            resp = jsonify({'avg_rating': None, 'msg': "OK"})
            resp.status_code = 200
            return resp
        else:
            curr_avg_rating = float(course_ratings_dict[course_code]["average_rating"])
            resp = jsonify({'avg_rating': curr_avg_rating, 'msg': "OK"})
            resp.status_code = 200
            return resp

    def post(self):
        course_code = request.args.get('course_code')
        rating = float(request.args.get('rating'))
        rating_details = course_ratings_dict.get(course_code, None)
        if rating_details is None:
            resp = jsonify({'avg_rating': None, 'error': f"No entry for the queried course code {course_code}"})
            resp.status_code = 400
            return resp
        
        if rating_details.get("average_rating", None) is None:
            course_ratings_dict[course_code]["average_rating"] = rating
            course_ratings_dict[course_code]["number_of_ratings"] = 1
        else:
            curr_avg_rating = float(course_ratings_dict[course_code]["average_rating"])
            curr_num_of_ratings = int(course_ratings_dict[course_code]["number_of_ratings"])
            course_ratings_dict[course_code]["average_rating"] = round((curr_avg_rating*curr_num_of_ratings + rating)/(curr_num_of_ratings+1), 2)
            course_ratings_dict[course_code]["number_of_ratings"] = curr_num_of_ratings + 1

        self.__update_json()

        try:
            resp = jsonify({'avg_rating': course_ratings_dict[course_code]["average_rating"],
                            'msg': "OK"})
            resp.status_code = 200
            return resp
        except Exception as e:
            resp = jsonify({'data': None, 'error': str(e)})
            resp.status_code = 400
            return resp

class UserReviews(Resource):
    def __update_json(self):
        with open("resources/user_reviews.json", "w") as write_file:
            json.dump(course_reviews_dict, write_file, indent=4)

    def get(self):
        course_code = request.args.get('course_code')
        reviews = course_reviews_dict.get(course_code, None)
        if reviews is not None:
            try:
                resp = jsonify(reviews)
                resp.status_code = 200
                return resp
            except Exception as e:
                resp = jsonify({'error': str(e)})
                resp.status_code = 400
                return resp
        else:
            resp = jsonify({'error': f"No entry for the queried course code {course_code}"})
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
        elif course_reviews_dict.get(course_code, None) is not None:
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
        course_code = request.args.get('course_code')
        res = self.__is_course_hss(course_code)
        try:
            resp = jsonify(res)
            resp.status_code = 200
            return resp
        except Exception as e:
            resp = jsonify({'error': str(e)})
            resp.status_code = 400
            return resp

class CheckAdminPW(Resource):
    def __is_match(self, pw):
        # Note this much serves as a proof of concept
        # Ideally the PW is stored in a database (SQL, MONGO) and is hashed
        return pw == 'ECE444'

    def post(self):
        pw = request.args.get('pw')
        try:
            resp = jsonify({'isAuth': self.__is_match(pw)})
            resp.status_code = 200
            return resp
        except Exception as e:
            resp = jsonify({'error': str(e)})
            resp.status_code = 400
            return resp

class CsEligibility(Resource):
    def __is_course_cs(self, course_code):
        courses = set(df_cs["colummn"])
        course_exceptions = set(df_cs_exceptions["colummn"])
        for course in courses:
            if course in course_code:
                if course_code not in course_exceptions: return True
                else: break
        return False

    def get(self):
        course_code = request.args.get('course_code')
        res = self.__is_course_cs(course_code)
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
rest_api.add_resource(UserRatings, '/course/ratings')
rest_api.add_resource(HssEligibility, '/check/hss')
rest_api.add_resource(CsEligibility, '/check/cs')
rest_api.add_resource(CheckAdminPW, '/admin/auth')

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

    
    
