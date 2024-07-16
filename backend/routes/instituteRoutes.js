import express from 'express'
import { 
    loginUser ,
    registerUser,
    getCoursesForRole,
    addCourses,
    deleteCourses,
    getListOfAllStudents,
    getListOfAllTeachers
} from '../controllers/instituteController.js'

const router = express.Router()

router.post('/login' , loginUser)
router.post('/register' , registerUser)
router.get('/courses/:role' , getCoursesForRole)
router.post('/courses/:role' , addCourses)
router.delete('/courses/:role/:id' , deleteCourses)
router.get('/students' , getListOfAllStudents)
router.get('/teachers' , getListOfAllTeachers)

export default router