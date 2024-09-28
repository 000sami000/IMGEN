import React, { useEffect, useState } from "react";
import { InputField, Card, Loader } from "../components";
import { RiVoiceprintLine } from "react-icons/ri";
import {useNavigate} from "react-router-dom"
import { FaMicrophone } from "react-icons/fa";
const RanderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }
  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  );
};

function Home() {
  const [loading, setloading] = useState(false);
  const [posts, setposts] = useState(null);
  const [searchText, setsearchText] = useState("");
   const [SearchedData,setSearchedData]=useState(null)
   const navigate=useNavigate();
  useEffect(() => {
    setloading(true);
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://imgen-zeta.vercel.app/api/v1/post", {
          method: "GET",
          headers: {
            "Contant-Type": "application/json",
          },
        });
        if(response.ok){
          const result=await response.json();
          console.log(result,";;;;")
          setposts(result.data.reverse());
        }
        // await response.json();
        // navigate("/");
      } catch (err) {
        console.log("get post err ---", err);
      } finally {
        setloading(false);
      }
    };
    fetchPosts();
  }, []);
 
   const handlesearch=(e)=>{
   setsearchText(e.target.value) ;

   setTimeout(()=>{
  const searchresult=posts.filter((itm)=>itm.name.toLowerCase().includes(searchText.toLowerCase())||
  itm.prompt.toLowerCase().includes(searchText.toLowerCase()));

   setSearchedData(searchresult)
   },500)
   }




   const [isListening, setIsListening] = useState(false);

   useEffect(() => {

     const SpeechRecognition =
       window.SpeechRecognition || window.webkitSpeechRecognition;
 
     if (SpeechRecognition) {
       const recognition = new SpeechRecognition();
 
       recognition.continuous = true; 
       recognition.interimResults = false; 
       recognition.lang = 'en-US'; 
 
       recognition.onresult = (event) => {
         const transcript = Array.from(event.results)
           .map((result) => result[0].transcript)
           .join('');
           setsearchText(transcript.split('.')[0].toLowerCase());
           const searchresult=posts.filter((itm)=>itm.name.toLowerCase().includes(transcript.split('.')[0].toLowerCase())||
           itm.prompt.toLowerCase().includes(transcript.split('.')[0].toLowerCase()));
         
            setSearchedData(searchresult)
       };
 
       recognition.onerror = (event) => {
         console.error('Error occurred in recognition: ' + event.error);
         setIsListening(false)
       };
 
       if (isListening) {
         recognition.start();
         console.log('Speech recognition started.');
       } else {
         recognition.stop();
         console.log('Speech recognition stopped.');
       }
 
 
       return () => {
         recognition.stop();
        //  setIsListening(false)
       };
     } else {
       alert('Sorry, your browser does not support Speech Recognition.');
     }
   }, [isListening]); 

   const handleListen = () => {
    setIsListening((prevState) => !prevState); 
  };
  return (
    <section className=" max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          The community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Browse through a collection of imaginative and visually stunning
          images
        </p>
      </div>
      <div className="mt-16 flex w-full gap-2">
<div className="w-[95%]">
        <InputField 
        labelName={"  Search"}
          type={'text'}
          name="searchtext"
          placeholder={"Search posts by typing or by voice"}
          value={searchText}
          handlechange={handlesearch}
        />
        </div>
      
        <button onClick={handleListen} className="bg-[#3062ea] rounded-md py-[8px] px-2 shadow-lg  self-center mt-6 flex justify-center items-center w-[5%]">{!isListening?<FaMicrophone className="text-[25px] text-white"/>:<RiVoiceprintLine className="text-[25px] text-white" />}</button>
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing results for{" "}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}

            <div
              className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3" >
              {searchText ? (
                <RanderCards data={SearchedData} title="No Search results found" />
              ) : (
                <RanderCards data={posts} title="No posts found" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Home;
