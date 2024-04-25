import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUpdateBlogMutation } from "./blogSlice"
import useTitle from "./../../hooks/useTitle"

const UpdateBlog = ({user, blog}) => {
    useTitle("update Blog")
    const authorId = 'use some staff to get the author id'
    const [UpdateBlog, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateBlogMutation()

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: authorId,
        category: '',
        image: null 
    });

    useEffect(() => {
        if (isSuccess) {
            setFormData([])
            navigate('/')
        }
    }, [isSuccess, navigate])


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
    
        reader.onload = () => {
            setFormData({
                ...formData,
                image: reader.result
            });
        };
    
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {           
            const response = await UpdateBlog(formData)
            console.log(response);
        } catch (error) {
            console.error(error); 
        }
    };
    const content = "blog form to update blog"

    return content
}

export default UpdateBlog