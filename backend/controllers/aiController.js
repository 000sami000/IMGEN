import * as dotenv from 'dotenv';
import axios  from "axios"
dotenv.config();

const convertImageToBase64 = async (url) => {
  try {
    // Fetch the image as a binary response (arraybuffer)
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    // Convert binary data to base64
    const base64 = Buffer.from(response.data).toString('base64');

    // Determine the content type from response headers or assume 'image/png'
    const contentType = 'image/png';

    // Return the complete base64 string with the correct data URI prefix
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error('Error converting image to base64:', error.message);
    return null;
  }
};
const generateImage = async (req, res) => {
    const {prompt}=req.body;
    // console.log("prompt---",prompt)
  try{
     
    const resp = await fetch(
      `https://api.limewire.com/api/image/generation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Version': 'v1',
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.IMG_GEN_KEY}`
        },
        body: JSON.stringify({
          prompt: prompt,
          negative_prompt: 'darkness, fog',
          samples: 1,
          quality: 'MID',
          guidance_scale: 50,
          aspect_ratio: '1:1',
          style: 'PHOTOREALISTIC'
        })
      }
    );
    const data = await resp.json();
    console.log(data,"---")
    // console.log(data?.data[0]?.asset_url);
    
if(data.detail){

   console.log("//?",data.detail)
 
 return  res.status(400).json({err:data.detail})
}else{
  let img=await convertImageToBase64(data?.data[0]?.asset_url);
  console.log("img---",img)
 return  res.status(200).json({photo:img})
}
  }catch(err){
    console.log(err)
    res.status(400).json({err:err})

  }
};

export { generateImage };