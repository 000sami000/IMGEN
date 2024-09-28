import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputField, Loader } from "../components";
import { FaFileImage } from "react-icons/fa6";
function CreatePost() {
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({
    name: "",
    prompt: "",
    photo: "",
  });

  const [loading, setloading] = useState(false);
  const [generatingImg, setgeneratingImg] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault()

     if(formdata.prompt && formdata.photo){
      setloading(true);
        try{
        const response=await fetch('https://imgen-zeta.vercel.app/api/v1/post',
          {
            method:'POST',
            headers:{
              'Content-Type':'application/json', 
            },
            body:JSON.stringify(formdata)
          }  )
         navigate("/")
        }catch(err){
       console.log("create post err ---",err)
        }finally{
          setloading(false)
        }
     }else{
      alert('Fields are empty')
     }
  };
  const handlechange = (e) => {
   
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };
  const generateImg = async () => {

    if (formdata.prompt) {
      try {
        setgeneratingImg(true);
        const response = await fetch("https://imgen-zeta.vercel.app/api/v1/ai/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: formdata.prompt }),
        });
        const data = await response.json();
        console.log(data)
        if(data.photo){


          setformdata({
            ...formdata,
            photo: `${data.photo}`,
          });
        }
        else{

          alert(data.err);
        }
      } catch (err) {
        console.log("generate image err--",err)
      } finally {
        setgeneratingImg(false);
      }
    } else {
      alert("Please fill the prompt field");
    }
  };
  return (
    <section className="max-w-7xl mx-auto ">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          Generate Image
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Convert the imagination to a visual image
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <InputField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formdata.name}
            handlechange={handlechange}
          />
          <InputField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="Enter prompt here to get the results"
            value={formdata.prompt}
            handlechange={handlechange}
          />
        </div>
        <div className="relative bg-gray-50 border-gray-300 border text-gray=900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 justify-center items-center mt-10">
          {formdata.photo ? (
            <img
              src={formdata?.photo}
              className="w-full h-full object-contain"
              alt={formdata.prompt}
            />
          ) : (
            <div className=" flex justify-center items-center h-full">
            <FaFileImage className="text-[150px] text-[gray]" />
            </div>
          )}
          {generatingImg && (
            <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
              <Loader />
            </div>
          )}
        </div>
        <div className="mt-5 flex gap-5">
          <button type="button"
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={generateImg}
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>
        <div className="mt-10">
          <p className=" mt-2 text-[#666e75] text-[14px]">
            Share your creativity with others in the community
          </p>
          <button type="submit" className="text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-3">
            {loading ? "Sharing..." : "Share with the community"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreatePost;
