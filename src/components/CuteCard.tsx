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
interface CuteCardProps {
  onHeaderClick: () => void; // This line is crucial for TypeScript
}

const CuteCard: React.FC<CuteCardProps> = ({ onHeaderClick }) => {
  const [inputPassword, setInputPassword] = useState<string>("");
  const [sliderValue, setSliderValue] = useState<number>(18);
  const [friendly, setFriendly] = useState<boolean>(false);
  const [upperLower, setUpperLower] = useState<boolean>(false);

  useEffect(() => {
    generatePassword(sliderValue, true, friendly, upperLower).then((password) =>
      setInputPassword(password)
    );
  }, [sliderValue, friendly, upperLower]);

  async function handleClick() {
    const password = await generatePassword(
      sliderValue,
      true,
      friendly,
      upperLower
    );
    setInputPassword(password);
    console.log(password);
  }

  return (
    <Card className="w-full lg:w-2/5 flex flex-col items-center text-purple-400 border-purple-300 bg-purple-100">
      <CardHeader className="items-center text-xl" onClick={onHeaderClick}>
        <CardTitle className="text-2xl">Cute password generator</CardTitle>
        <CardDescription className="text-slate-500 text-lg">
          A cute password generator for the whole family or just you
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center w-4/5">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            className="text-purple-500 text-xl"
            readOnly
            placeholder={inputPassword}
            value={inputPassword}
          />
          <CopyIcon
            className="hover:text-purple-900 hover:cursor-pointer w-10 h-10"
            onClick={() => {
              navigator.clipboard.writeText(inputPassword);
              toast("Copied to clipboard!");
            }}
          />
          <Toaster />
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
            className="data-[state=checked]:bg-purple-400"
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
            className="data-[state=checked]:bg-purple-400"
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
          className="bg-purple-400 hover:bg-purple-700 text-lg"
          onClick={handleClick}
        >
          Generate
        </Button>
      </CardContent>
      <CardFooter className="text-sm text-stone-400">
        <p>Inspired by Espen</p>
      </CardFooter>
    </Card>
  );
};

export default CuteCard;
