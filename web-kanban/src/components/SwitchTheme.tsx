import { Button } from "@mui/material";
import { MoonStars } from "phosphor-react";

export function SwitchTheme(props: {
  setIsDarkMode: Function;
  isDarkMode: boolean;
}) {
  return (
    <div
      className={
        props.isDarkMode
          ? "bg-white absolute rounded-[50%] transition-all   left-6 top-4"
          : "bg-[#211c1c] absolute rounded-[50%] transition-all    left-6 top-4"
      }
      id="themeSwitch"
    >
      <Button
        onClick={() => {
          props.setIsDarkMode(!props.isDarkMode);
        }}
        className=" flex  w-full h-full  !rounded-[50%] items-center justify-center"
      >
        <MoonStars size={60} color="#19ccc0" />
      </Button>
    </div>
  );
}
