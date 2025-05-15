import Image from 'next/image';

type Props = {
  question: string;
  answer: string;
};

export default function ChatBot({ question, answer }: Props) {
  return (
    <div className="bg-[#4272C8] p-8 rounded-[40px] mt-5 md:mt-0 font-tektur shadow-inner-and-drop
     w-[395px] h-[266px] flex justify-center items-center border-[#B3FEED] border-2">
      <div className="bg-[#46BDFF] p-4 rounded-[40px] w-[330px] h-[182px] border-[#B3FEED] border-2">
        {/* Bot message */}
        <div className="flex items-center gap-2 mb-2 mt-4">
          <div className="w-[41px] h-[41px] rounded-full bg-white flex items-center justify-center overflow-hidden">
            <Image src="/assets/images/Registration/chatbot.svg" alt="Bot Icon" width={41} height={41} />
          </div>
          <div className="bg-[#4272C8] w-[121px] h-[40px] text-white px-4 py-1 pt-3
           rounded-tr-[22px] rounded-tl-[22px] rounded-br-[22px]  text-[11px] text-center">
            {question}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <div
            className={`bg-[#4272C8] text-white px-4 rounded-tr-[22px] rounded-tl-[22px] rounded-bl-[22px]
              py-1 text-[11px] min-h-[40px] min-w-[121px] flex items-center text-center mt-3`}
          >
            {answer || '\u00A0'}
          </div>
          <Image src="/assets/images/Registration/user.svg" alt="User Icon" width={41} height={41}  className='mt-3'/>
        </div>
      </div>
    </div>
  );
}
