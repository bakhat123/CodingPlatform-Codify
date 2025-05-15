interface StandingProps {
  userRank?: number;
  totalUsers: number;
}

const Standing = ({ userRank, totalUsers }: StandingProps) => {
  const getOrdinalSuffix = (num?: number) => {
    if (!num) return '';
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };

  return (
    <div className='flex items-center h-[40px] w-fit px-5 bg-[#1D2237] 
    rounded-xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] text-[#646C8B]
    font-tektur tracking-wider font-medium text-[12px] mt-4 pointer-events-none'>
      This Weekend {" "}
      {userRank ? (
        <>
          <p className='ml-1'>you are ranked</p>  
          <span className='ml-1 text-white'>
            {userRank}
            <sup>{getOrdinalSuffix(userRank)}</sup>
          </span>
          <p className='ml-1'>out of</p>
        </>
      ) : (
        <p className='ml-1'>total</p>
      )}
      <span className='ml-1 text-white'>{totalUsers} users</span>
    </div>
  );
};

export default Standing;