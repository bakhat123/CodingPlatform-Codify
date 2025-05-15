import SocialIcons from "./subui/SocialIcons";

function Footer() {
  return (
    <footer className="w-full h-[11.25vh] bottom-[0vh] flex items-center justify-between  px-[11.8571vh] border-t-[0.1786vh] border-opacity-50 border-t-stroke">
      {/* Left Content */}
      <div className="text-lightGray font-sourceCodePro text-[1.9643vh] font-medium">
        © 2025. All rights reserved.
      </div>

      <SocialIcons/>
    </footer>
  );
}

export default Footer;
