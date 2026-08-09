import {Canvas} from "@react-three/fiber";
import {Center, OrbitControls} from "@react-three/drei";
import {Bloom, BrightnessContrast, EffectComposer, HueSaturation, N8AO, ToneMapping} from "@react-three/postprocessing";
import {ToneMappingMode} from "postprocessing";
import {RefObject} from "react";
import {Group} from "three";
import {InitiativeMarker} from "@/components/InitiativeMarker";
import {DmScreen} from "@/components/DmScreen";
import {InitiativeEnvironment} from "@/components/initiativeEnvironment";
import type {MarkerFontId} from "@/lib/marker-fonts";

export function MarkerDisplay({text, radius, padding, boxColor, textColor, font, sceneRef}: {
    text: string;
    radius: number,
    padding: number,
    boxColor: string;
    textColor: string;
    font: MarkerFontId;
    sceneRef: RefObject<Group>
}) {
    return (
        <div className="aspect-video w-full overflow-hidden rounded-3xl [&_canvas]:rounded-3xl">
            <Canvas shadows="percentage" camera={{fov: 45, position: [1, 0, -5]}}>
                <ambientLight intensity={0.45}/>
                <directionalLight position={[0, 5, 7.5]} intensity={1.6} castShadow/>
                <directionalLight position={[0, 3, -10]} intensity={1.6} castShadow/>

                <group position={[0, -0.5, 0]}>
                    <Center top>
                        <InitiativeMarker text={text} radius={radius} padding={padding} boxColor={boxColor}
                                          textColor={textColor} font={font} sceneRef={sceneRef}/>
                    </Center>
                    <DmScreen/>
                </group>
                <OrbitControls minPolarAngle={1} maxPolarAngle={2} enablePan={false}/>
                <EffectComposer>
                    <N8AO aoRadius={0.15} intensity={1.8} distanceFalloff={2}/>
                    <Bloom luminanceThreshold={1.1} intensity={0.9} levels={9} mipmapBlur/>
                    <ToneMapping mode={ToneMappingMode.ACES_FILMIC}/>
                    <BrightnessContrast brightness={0.03} contrast={0.08}/>
                    <HueSaturation saturation={0.08}/>
                </EffectComposer>
                <InitiativeEnvironment/>
            </Canvas>
        </div>
    )
}
