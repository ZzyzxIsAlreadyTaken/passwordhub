import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Input } from "./ui/input";
import { generatePassword } from "./passwordgenerator";
import { CopyIcon } from "@radix-ui/react-icons";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";

// Ensure onHeaderClick is typed correctly if TypeScript is used
interface DirtyCardProps {
  onHeaderClick: () => void; // This line is crucial for TypeScript
}

const DirtyCard: React.FC<DirtyCardProps> = ({ onHeaderClick }) => {
  const [inputPassword, setInputPassword] = useState<string>("");
  const [sliderValue, setSliderValue] = useState<number>(18);
  const [friendly, setFriendly] = useState<boolean>(false);
  const [upperLower, setUpperLower] = useState<boolean>(false);

  useEffect(() => {
    generatePassword(sliderValue, false, friendly, upperLower).then(
      (password) => setInputPassword(password)
    );
  }, [sliderValue, friendly, upperLower]);

  async function handleClick() {
    const password = await generatePassword(sliderValue, false, friendly);
    setInputPassword(password);
    console.log(password);
  }

  return (
    <Card className="w-full lg:w-2/5  flex flex-col items-center text-[#F1931C] border-[#F1931C] bg-slate-800">
      <CardHeader className="items-center" onClick={onHeaderClick}>
        <CardTitle className="text-2xl">
          Not so cute password generator
        </CardTitle>
        <CardDescription className="text-white text-lg">
          A not so cute password generator for no one (or Espen)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center w-4/5">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            className="text-[#F1931C] text-xl"
            readOnly
            placeholder={inputPassword}
            value={inputPassword}
          />
          <CopyIcon
            className="hover:text-red-900 hover:cursor-pointer w-10 h-10"
            onClick={() => {
              navigator.clipboard.writeText(inputPassword);
              toast("Copied to clipboard!");
            }}
          />
          <Toaster
            toastOptions={{
              className: "text-[#F1931C] bg-slate-800 border-[#F1931C]",
            }}
          />
        </div>
        <div className="w-4/5 flex gap-2">
          <Slider
            defaultValue={[sliderValue]}
            max={30}
            min={12}
            step={1}
            onValueChange={(value) => setSliderValue(value[0])}
          />
          <div>{sliderValue}</div>
        </div>
        <div className="items-top flex space-x-2">
          <Checkbox
            className="data-[state=checked]:bg-[#F1931C] border-[#F1931C]"
            id="friendlyPassword"
            onCheckedChange={(isChecked) => {
              // Check if isChecked is a boolean before calling setFriendly
              if (isChecked === true || isChecked === false) {
                setFriendly(isChecked);
              }
            }}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="friendlyPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Friendly (no special characters)
            </label>
          </div>
        </div>
        <div className="items-top flex space-x-2">
          <Checkbox
            className="data-[state=checked]:bg-[#F1931C] border-[#F1931C]"
            id="upperLower"
            onCheckedChange={(isChecked) => {
              // Check if isChecked is a boolean before calling setFriendly
              if (isChecked === true || isChecked === false) {
                setUpperLower(isChecked);
              }
            }}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="upperLower"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Random UpperLower
            </label>
          </div>
        </div>
        <Button
          className="bg-[#F1931C] hover:bg-red-500 text-lg"
          onClick={handleClick}
        >
          Generate
        </Button>
      </CardContent>
      <CardFooter className="text-sm text-stone-400">
        <p>Even more inspired by Espen</p>
      </CardFooter>
    </Card>
  );
};

export default DirtyCard;
