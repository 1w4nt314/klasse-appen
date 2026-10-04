"use client";

import { useRef } from "react";
import { Field } from "./ui";

/**
 * Ny adgangskode skrevet to gange. Browseren afviser formularen, hvis de ikke
 * er ens (serveren tjekker det også).
 */
export function NewPasswordFields() {
  const first = useRef<HTMLInputElement>(null);
  const second = useRef<HTMLInputElement>(null);
  const check = () => {
    const a = first.current;
    const b = second.current;
    if (!a || !b) return;
    b.setCustomValidity(b.value && a.value !== b.value ? "De to adgangskoder er ikke ens." : "");
  };
  return (
    <>
      <Field
        ref={first}
        label="Adgangskode"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        maxLength={200}
        hint="Mindst 8 tegn."
        onInput={check}
        required
      />
      <Field
        ref={second}
        label="Gentag adgangskode"
        name="password_confirm"
        type="password"
        autoComplete="new-password"
        minLength={8}
        maxLength={200}
        onInput={check}
        required
      />
    </>
  );
}
