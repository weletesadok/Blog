import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewBlogMutation } from "./blogSlice"
import useTitle from "./../../hooks/useTitle"
import useAuth from "./../../hooks/useAuth"


const AddBlog = () => {
    const {username} = useAuth()

    useTitle("Add New Blog")
    const [addNewBlog, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewBlogMutation()

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: username,
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
            console.log(formData)        
            const response = await addNewBlog(formData)
            console.log(response);
        } catch (error) {
            console.error(error); 
        }
    };
    const content = (
        <div className="bg-white dark:bg-gray-900 border-1-solid">
        <div className="flex justify-center h-screen">
            <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
                <div className="flex-1">
                    <div className="text-center">
                        <div className="flex justify-center mx-auto">
                            <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt="" />
                        </div>

                        <p className="mt-3 text-gray-500 dark:text-gray-300">Add beautiful posts</p>
                    </div>

                    <div className="mt-8">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="title" className=" hidden block mb-2 text-sm text-gray-600 dark:text-gray-200">title</label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                />
                            </div>
                            <div>
                                <label htmlFor="content" className="hidden block mb-2 text-sm text-gray-600 dark:text-gray-200">content</label>
                                <textarea
                                    type="text"
                                    name="content"
                                    id="content"
                                    placeholder="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                />
                            </div>
                            <div>
                                <label htmlFor="category" className=" hidden block mb-2 text-sm text-gray-600 dark:text-gray-200">category</label>
                                <input
                                    type="text"
                                    name="category"
                                    id="category"
                                    placeholder="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                />
                            </div>


                            <div className="relative flex items-center mt-6 p-0">
   

    <input id="dropzone-file" type="file" onChange={handleImageChange} className="hidden" />

    <label htmlFor="dropzone-file" className="flex items-center px-3 py-3 mx-auto text-center bg-white border-2 border-solid rounded-lg cursor-pointer dark:border-gray-600 dark:bg-gray-900">
        
        
        <p className={`text-gray-400 ${formData.image && 'hidden'}`}>Choose image</p>
    {formData.image && (
        <img src={formData.image} alt="image" className="w-30 h-30  ml-2" />
    )}
    </label>

</div>

                           
                       
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                                >
                                    Add Post
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
    )

    return content
}

export default AddBlog