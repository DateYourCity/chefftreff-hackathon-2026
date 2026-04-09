"use client";

import confetti from "canvas-confetti";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type QrReturnLinkProps = {
    href: string;
    imageSrc: string;
    label: string;
};

export function QrReturnLink({ href, imageSrc, label }: QrReturnLinkProps) {
    const router = useRouter();
    const [isClosing, setIsClosing] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    function fireConfetti() {
        void confetti({
            particleCount: 84,
            spread: 78,
            startVelocity: 34,
            origin: { y: 0.68 },
            scalar: 0.9,
        });

        window.setTimeout(() => {
            void confetti({
                particleCount: 38,
                spread: 110,
                startVelocity: 26,
                origin: { y: 0.62 },
                colors: ["#14b8a6", "#f97316", "#facc15", "#fb7185", "#60a5fa"],
            });
        }, 120);
    }

    function handleClick() {
        if (isClosing) {
            return;
        }

        setIsClosing(true);
        fireConfetti();
        timeoutRef.current = window.setTimeout(() => {
            router.push(href);
        }, 700);
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={`Open ${label}`}
            className="relative block w-full overflow-hidden"
        >
            <Image
                src={imageSrc}
                alt={`QR code to open ${label}`}
                width={1400}
                height={1400}
                className={`h-auto w-full cursor-pointer transition-[transform,opacity,filter] duration-700 ${isClosing ? "scale-[0.94] opacity-0 blur-[2px]" : "opacity-100"
                    }`}
                priority
            />
        </button>
    );
}