import {useState} from 'react';
import {Canvas} from "@react-three/fiber";
import {AccumulativeShadows, Center, OrbitControls, RandomizedLight} from '@react-three/drei';
import {Bloom, EffectComposer, N8AO, ToneMapping} from "@react-three/postprocessing";
import styles from "./styles.module.scss";
import {InitiativeMarker} from "@/components/react-three/InitiativeMarker";
import {InitiativeEnvironment} from "@/components/react-three/initiativeEnvironment";
import {InputText} from "primereact/inputtext";
import {ColorPicker} from "primereact/colorpicker";


export default function Home() {
    const [text, setText] = useState("Strahd von Zarovich");
    const [boxColor, setBoxColor] = useState("#0000ff");
    const [textColor, setTextColor] = useState("#ffffff");

    return (
        <>
            <div className={styles.canvas}>
                <Canvas shadows>
                    <ambientLight intensity={0.3}/>
                    <directionalLight
                        position={[5, 10, 7.5]}
                        intensity={1}
                        castShadow
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                    />
                    <group position={[0, -0.5, 0]}>
                        <Center top>
                            <InitiativeMarker text={text} boxColor={boxColor} textColor={textColor}/>
                        </Center>
                        <AccumulativeShadows temporal frames={100} color={"black"} opacity={1.05}>
                            <RandomizedLight radius={5} position={[10, 5, -5]}/>
                        </AccumulativeShadows>
                    </group>
                    <OrbitControls enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI}/>
                    <EffectComposer>
                        <N8AO aoRadius={0.15} intensity={4} distanceFalloff={2}/>
                        <Bloom luminanceThreshold={3.5} intensity={0.85} levels={9} mipmapBlur/>
                        <ToneMapping/>
                    </EffectComposer>
                    <InitiativeEnvironment/>
                </Canvas>
            </div>
            <div className="text-center">
                <InputText value={text} onInput={e => setText((e.target as HTMLInputElement).value)}/>
                <ColorPicker value={boxColor} onChange={(e) => setBoxColor("#" + e.value?.toString())}/>
                <ColorPicker value={textColor} onChange={(e) => setTextColor("#" + e.value?.toString())}/>
            </div>
        </>
    );
}



