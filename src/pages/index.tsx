import {RefObject, useRef, useState} from 'react';
import {PopoverPicker} from "@/components/PopoverPicker";
import {MarkerDisplay} from "@/components/MarkerDisplay";
import {STLExporter} from "three/examples/jsm/exporters/STLExporter";
import {Group} from "three";
import styles from './styles.module.scss';

const exporter = new STLExporter();

function DownloadButton({text, scene}: { text: string; scene: RefObject<Group> }) {
    const downloadSTL = () => {
        scene.current.scale.set(20, 20, 20);
        scene.current.updateMatrixWorld(true);

        const blob = new Blob([exporter.parse(scene.current)], {type: 'application/octet-stream'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${text}.stl`;
        link.click();
        scene.current.scale.set(1, 1, 1);
    };

    return <div onClick={downloadSTL} className={styles.button}>Download STL</div>;
}

export default function Home() {
    const [text, setText] = useState("Strahd von Zarovich");
    const [boxColor, setBoxColor] = useState("#0000ff");
    const [textColor, setTextColor] = useState("#ffffff");
    const [radius, setRadius] = useState(0.8);
    const [padding, setPadding] = useState(0.5);

    const sceneRef = useRef<Group>(null!);

    return (
        <div className={styles.container}>
            <MarkerDisplay text={text}
                           radius={radius / 10}
                           padding={padding}
                           boxColor={boxColor}
                           textColor={textColor}
                           sceneRef={sceneRef}/>

            <div className={styles.background}/>
            <div className={styles["form-container"]}>
                <label>Marker text <br/>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter name"/>
                </label>
                <label>
                    Corner smoothing <br/>
                    <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={radius}
                        onChange={(e) => setRadius(parseFloat(e.target.value))}
                    />
                </label>
                <label>
                    Padding <br/>
                    <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={padding}
                        onChange={(e) => setPadding(parseFloat(e.target.value))}
                    />
                </label>

                <label>Preview box color</label>
                <PopoverPicker color={boxColor} onChange={setBoxColor}/>
                <label>Preview text color</label>
                <PopoverPicker color={textColor} onChange={setTextColor}/>

                <DownloadButton text={text} scene={sceneRef}></DownloadButton>
            </div>
        </div>
    );
}



