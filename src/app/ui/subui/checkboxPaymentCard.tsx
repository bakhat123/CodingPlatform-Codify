import Image from "next/image";

function CheckboxPaymentCard({text}: {text: string}) {
    return ( 
        <div className="flex flex-row space-x-[1.3vh] items-center w-full">
            <div className="size-[2.5vh]">
                <Image src={'assets/images/pricing/check.svg'} alt="checkbox" width={16} height={16} objectFit="cover"/>
            </div>
            <div className="font-sora text-[1.3vh]">{text}</div>
        </div>
    );
}

export default CheckboxPaymentCard;