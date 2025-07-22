import {Canvas} from "@react-three/fiber";
import {Center, OrbitControls} from "@react-three/drei";
import {Bloom, EffectComposer, N8AO, ToneMapping} from "@react-three/postprocessing";
import React, {memo, RefObject, useRef} from "react";
import {DirectionalLight, Group} from "three";
import {InitiativeMarker} from "@/components/InitiativeMarker";
import {DmScreen} from "@/components/DmScreen";
import {InitiativeEnvironment} from "@/components/initiativeEnvironment";
import styles from "./MarkerDisplay.module.scss";

export const MarkerDisplay = memo(({text, radius, padding, boxColor, textColor, sceneRef}: {
    text: string;
    radius: number,
    padding: number,
    boxColor: string;
    textColor: string;
    sceneRef: RefObject<Group>
}) => {
    const dirLight1 = useRef<DirectionalLight>(null);
    const dirLight2 = useRef<DirectionalLight>(null);

    return (
        <div className={styles.canvas}>
            <Canvas shadows camera={{fov: 45, position: [1, 0, -5]}}>
                <ambientLight intensity={0.3}/>
                <directionalLight ref={dirLight1} position={[0, 5, 7.5]} intensity={1} castShadow/>
                <directionalLight ref={dirLight2} position={[0, 3, -10]} intensity={1} castShadow/>
                {dirLight1.current && dirLight2.current && (<>
                    <directionalLightHelper args={[dirLight1.current, 2, 0xff0000]}/>
                    <directionalLightHelper args={[dirLight2.current, 2, 0xffff00]}/>
                </>)}

                <group position={[0, -0.5, 0]}>
                    <Center top>
                        <InitiativeMarker text={text} radius={radius} padding={padding} boxColor={boxColor}
                                          textColor={textColor} sceneRef={sceneRef}/>
                    </Center>
                    <DmScreen/>
                </group>
                <OrbitControls minPolarAngle={1} maxPolarAngle={2} enablePan={false}/>
                <EffectComposer>
                    <N8AO aoRadius={0.15} intensity={4} distanceFalloff={2}/>
                    <Bloom luminanceThreshold={3.5} intensity={0.85} levels={9} mipmapBlur/>
                    <ToneMapping/>
                </EffectComposer>
                <InitiativeEnvironment/>
            </Canvas>
        </div>
    )
});

MarkerDisplay.displayName = "MarkerDisplay";