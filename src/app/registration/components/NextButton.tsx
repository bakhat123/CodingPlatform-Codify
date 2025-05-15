import Button from "@/app/ui/subui/Button";

type Props = {
    onClick: () => void;
  };
  
  export default function NextButton({ onClick }: Props) {
    return (
      <Button top="0px" left="0px" pos=" py-2 px-6 w-[150px] h-[50px] font-semibold text-[22px]" onClick={onClick}>
        Next
      </Button>
    );
  }
  