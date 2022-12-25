import { CircleNotch } from "phosphor-react";

export function Loading(props?: any) {
  return (
    <div className=" flex items-center justify-center">
      <CircleNotch
        size={props.size || 50}
        weight="bold"
        className="text-white animate-spin"
      />
    </div>
  );
}
