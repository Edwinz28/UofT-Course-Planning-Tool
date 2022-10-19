# using hard-coded data for testing purpose, should be fetch in database later on
engineering_certificate_list = {
    'Artificial Intelligence Certificate' : [],
    'Advanced Manufacturing Certificate' : [],
    'Bioengineering Certificate' : [],
    'Environmental Engineering Certificate' : [],
    'Sustainable Energy Certificate' : [],
    'Engineering Business Certificate' : [],
    'Robotics and Mechatronics Certificate' : [],
    'Biomedical Engineering Certificate' : [],
    'Nanoengineering Certificate' : [],
    'Music Performance Certificate' : [],
}

# Calcualting the percentage of minor fulfillment
def check_course_in_certificate(course):
    minor = None
    for i in engineering_certificate_list:
        if course in engineering_certificate_list[i]:
            certificate = i

    return certificate