import PaymentCard from "@/app/ui/subui/PaymentCard";
import Image from "next/image";

function PaymentSection() {
    return ( 
        <div id="payment-section" className="h-screen w-full bg-primary flex flex-col text-white border-2 border-border mt-1">
            
            <div className="flex flex-col items-center text-center">
                <div className="w-full h-[15vh] flex items-center justify-center font-sourceCodePro text-[2vh]">
                    <span className="flex items-center justify-center">{'{'}</span>Get Started with Codify<span className="flex items-center justify-center">{' }'}</span>
                </div>
                <div className="w-full h-[15vh] text-center flex items-center justify-center text-[7.6vh] font-sora">
                    <p>Pay once, Enjoy for a month</p>
                </div>
            </div>
            <div className="grid grid-cols-5 justify-center">
                <div className="flex items-center justify-center h-[60vh]">
                    <Image 
                        src={"/assets/images/pricing/startCurve.svg"}
                        alt="start curve"
                        height={176}
                        width={175}
                        className="w-full"
                    />
                </div>
                <div className="h-[60vh]  flex items-end">
                    <PaymentCard src="/assets/images/pricing/Price.svg" text="Basic" subText="Entry to weekly tournaments and access to many other features" style="text-paymentcardtext" width="w-[7vh] h-[5.7vh]" items={["Paid Entry to Weekly Challenges","Appear in Global LeaderBoards","Buy Exciting items in shop"]}/>
                </div>
                <div className="flex items-start justify-center py-[11.87vh] h-[60vh]">
                    <Image 
                        src={"/assets/images/pricing/centerCurve.svg"}
                        alt="center curve"
                        height={146.64}
                        width={252.84}
                        className="w-full"
                    />
                </div>
                <div className="h-[60vh] flex items-start">
                    <PaymentCard src="/assets/images/pricing/Price1.svg" text="Premium" subText="Entry to weekly tournaments and access to many other features + exciting gifts" style="text-paymentcardtext2" width="w-[17vh] h-[6vh]" items={["Free Entry to Weekly Challenges","Appear in Global LeaderBoards","Buy Exciting items in shop and get Exciting Daily Rewards"]}/>
                </div>
                <div className="flex justify-center items-center py-[11.87vh] h-[60vh]">
                    <Image 
                        src={"/assets/images/pricing/endCurve.svg"}
                        alt="end curve"
                        height={176}
                        width={175}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
}

export default PaymentSection;