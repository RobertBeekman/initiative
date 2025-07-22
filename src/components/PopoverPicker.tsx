import {useCallback, useRef, useState} from "react";
import {useClickOutside} from "@/hooks/use-click-outside";
import {HexColorPicker} from "react-colorful";
import styles from "./PopoverPicker.module.scss";

type PopoverPickerProps = {
    color: string;
    onChange: (color: string) => void;
};

export const PopoverPicker = ({color, onChange}: PopoverPickerProps) => {
    const popover = useRef<HTMLDivElement | null>(null);
    const [isOpen, toggle] = useState(false);

    const close = useCallback(() => toggle(false), []);
    useClickOutside(popover, close);

    return (
        <div className={styles.picker}>
            <div
                className={styles.swatch}
                style={{backgroundColor: color}}
                onClick={() => toggle(true)}
            />

            {isOpen && (
                <div className={styles.popover} ref={popover}>
                    <HexColorPicker color={color} onChange={onChange}/>
                </div>
            )}
        </div>
    );
};