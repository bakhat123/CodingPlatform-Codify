import Image from "next/image";
import Button from "@/app/ui/subui/Button"

function HeroSection() {
    return ( 
        <div className="h-screen w-full flex space-y-[5.4vh] flex-col items-center justify-center relative border-2 border-border overflow-hidden">
            {/* Background Images */}
            <Image
                src="/assets/images/hero/gradient.png"
                alt="Gradient Background"
                fill
                style={{ objectFit: "cover" }}
                className="inset-0 opacity-30"
            />
            <Image
                src="/assets/images/hero/background.png"
                alt="Background Image"
                fill
                style={{ objectFit: "cover" }}
                className="inset-0 opacity-20"
            />
            <Image
                src="/assets/images/hero/stars.svg"
                alt="Stars Background"
                fill
                style={{ objectFit: "cover" }}
                className="inset-0 opacity-100 "
            />
            {/* <Image
                src="/assets/images/hero/image.png"
                alt="Hero Image"
                width={169}
                height={95}
                className="top-[388px] left-[848px] opacity-100 cover"
            /> */}

            {/* Text Content */}
            <div className="z-1 text-white w-[120vh] h-auto text-center leading-normal font-sora text-[7.5vh] font-[800] no-underline">
                Code with your Best, Compete, and Win with <span className="text-purple-600">Codify</span>
            </div>
            <div className="z-1 text-lightGray w-[100vh] h-auto text-center font-sora text-[2.5vh] font-light ">
                Unleash your coding skills, conquer exciting challenges, and rise to the top of the leaderboard in thrilling competitions!
            </div>
            
            <div className="z-10">
                <Button top="0px" left="0px" pos=" w-[27vh] h-[9vh]" disabled={false}>Get Started</Button>
            </div>
            {/* <div className="absolute z-1 text-lightGray w-[433px] h-auto text-center top-[415px] left-[390px] font-sourceCodePro text-[11px] font-normal ">
               HELPING STUDENTS TO BECOME COMPETENT IN CODING RELATED ACTIVITIES
            </div>

            <p className="z-1 text-white absolute left-[330px] top-[470px] w-[555px] h-[120px] text-center text-[32px]  font-sourceCodePro drop-shadow-2xl divide-red-600">
              Master the Challange, Dominate Coding with <br/>Codify
            </p> */}
        </div>
    );
}

export default HeroSection;
