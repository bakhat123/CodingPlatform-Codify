import React from 'react'

interface HeadingProps {
  title: string;
}

const Heading:React.FC<HeadingProps> = ({title}) => {
  return (
    <div className="text-white text-[35px] font-tektur
     mt-[30px] ml-[60px] mb-[20px] tracking-[1px]"
     style={{
       textShadow: `
         0 4px 4px rgba(0,0,0,0.25),      
         0 -1px 0 rgba(255,255,255,0.1),  
         0 1px 0 rgba(0,0,0,0.3)          
       `,
     }}
   > {title} </div>
  )
}

export default Heading