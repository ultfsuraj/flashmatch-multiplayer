'use client';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { FormEvent, useEffect, useState } from 'react';
import { cn } from ' @/utils/cn';
import Button from ' @/components/Button';

const joinSchema = zfd.formData({
  roomName: zfd.text(
    z
      .string()
      .max(15, { message: 'Room Name must be less than 15 characters' })
      .optional()
      .refine((val) => val && val.length > 0, { message: "Room can't be empty" })
  ),
  playerName: zfd.text(
    z
      .string()
      .max(20, { message: 'Player Name must be less than 20 characters' })
      .optional()
      .refine((val) => val && val.length > 0, { message: "Player can't be empty" })
  ),
});

const RoomJoinForm = ({
  onClick,
  className = '',
  errMsg = '',
}: {
  onClick: (playerName: string, roomName: string) => void;
  className?: string;
  errMsg?: string;
}) => {
  const [errors, setErrors] = useState<string[]>([errMsg]);
  useEffect(() => {
    setErrors([errMsg]);
  }, [errMsg]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const result = joinSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.issues.map((err) => err.message));
      setTimeout(() => {
        setErrors([]);
      }, 2000);
    } else {
      onClick(result.data.playerName!, result.data.roomName!);
    }
  };

  return (
    <form
      className={cn(
        'flex-center w-full flex-col gap-2 rounded-md bg-slate-50 px-6 pt-4 pb-3 text-xs text-neutral-700 shadow-2xl drop-shadow-2xl',
        className
      )}
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <fieldset className="font-montserrat rounded border border-current px-2 py-1">
        <legend className="px-2">Room Name</legend>
        <input name="roomName" className="px-2 pb-1.5 text-neutral-500 focus:outline-0" placeholder="Enter room name" />
      </fieldset>
      <fieldset className="font-montserrat rounded border border-current px-2 py-1">
        <legend className="px-2">Player Name</legend>
        <input
          name="playerName"
          className="px-2 pb-1.5 text-neutral-500 focus:outline-0"
          placeholder="Enter your name"
        />
      </fieldset>
      {errors.map((err, index) => (
        <p key={index} className="w-[80%] text-center text-sm text-red-500">
          {err}
        </p>
      ))}
      <Button text="Join" type="submit" className="px-4" />
    </form>
  );
};

export default RoomJoinForm;
