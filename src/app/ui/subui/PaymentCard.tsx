import Button from "@/app/ui/subui/Button";
import Lines from "./lines";
import Image from "next/image";
import CheckboxPaymentCard from "./checkboxPaymentCard";

function PaymentCard({text, subText, src, items, width, style}: {text: string, subText: string, src: string, items: string[], width: string, style: string}) {
    const spaceY = '10';
    return ( 
        <div className={`hover:scale-[102%] transition-all duration-200 p-[4.6vh] relative h-[56.5vh] space-y-[1.6vh] w-[38.6vh] bg-primary flex border-[0.08vh] border-stroke border-opacity-50 items-center justify-center flex-col rounded-[3.16vh]`}>
            <div className={`flex flex-col items-start justify-center space-y-[1.6vh]`}>
                <div className={`font-semibold text-[3.8vh] font-sora ${style}`}>{text}</div>
                <div className="font-sora text-[1.42vh] text-center text-[#67666C]">{subText}</div>
                <div className={`w-[7vh] h-[5.7vh]`}>
                    <Image
                        src={`${src}`}
                        alt="price"
                        width={108}
                        height={200}
                        objectFit="cover"
                    />
                </div>
                <Button children={"Get Started"} top="0px" left="0px" pos=" w-[29.7vh] h-[4.7vh]"/>
            </div>
            {
                items.map((item, index) => (
                    <div key={index} className={`space-y-[1.6vh]`}>
                        <Lines />
                        <CheckboxPaymentCard text={item}/>
                    </div>
                ))
            }
        </div>
    );
}

export default PaymentCard;