import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import domine from "../../public/fonts/Domine-Regular.json";
import fingerPaint from "../../public/fonts/FingerPaint-Regular.json";
import chewy from "../../public/fonts/Chewy-Regular.json";
import bitcountPropSingle from "../../public/fonts/BitcountPropSingle-Regular.json";
import blackOpsOne from "../../public/fonts/BlackOpsOne-Regular.json";
import caveat from "../../public/fonts/Caveat-Regular.json";
import eduNSWACTCursive from "../../public/fonts/EduNSWACTCursive-Regular.json";
import geistPixel from "../../public/fonts/GeistPixel-Regular.json";
import jimNightshade from "../../public/fonts/JimNightshade-Regular.json";
import josefinSans from "../../public/fonts/JosefinSans-Thin.json";
import libertinusMath from "../../public/fonts/LibertinusMath-Regular.json";
import montserrat from "../../public/fonts/Montserrat-Thin.json";
import playwriteDESASGuides from "../../public/fonts/PlaywriteDESASGuides-Regular.json";
import quicksand from "../../public/fonts/Quicksand-Light.json";
import {extend} from "@react-three/fiber";
import {BoxGeometry, Group, Matrix4, Shape, ExtrudeGeometry} from "three";
import {RefObject, useEffect} from "react";
import {CSG} from "three-csg-ts";
import type {MarkerFontId} from "@/lib/marker-fonts";

extend({TextGeometry})

const FONT_DATA: Record<MarkerFontId, object> = {
    domine,
    fingerPaint,
    chewy,
    bitcountPropSingle,
    blackOpsOne,
    caveat,
    eduNSWACTCursive,
    geistPixel,
    jimNightshade,
    josefinSans,
    libertinusMath,
    montserrat,
    playwriteDESASGuides,
    quicksand,
};

function createBoxWithRoundedEdges(width: number, height: number, depth: number, radius0: number, smoothness: number) {
    const shape = new Shape();
    const eps = 0.00001;
    const radius = radius0 - eps;
    shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
    shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
    shape.absarc(width - radius * 2, height - radius * 2, eps, Math.PI / 2, 0, true);
    shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);
    const geometry = new ExtrudeGeometry(shape, {
        depth: depth - radius0 * 2,
        bevelEnabled: true,
        bevelSegments: smoothness * 2,
        steps: 1,
        bevelSize: radius,
        bevelThickness: radius0,
        curveSegments: smoothness
    });

    geometry.center();

    return geometry;
}

export function InitiativeMarker({text, radius, padding, textColor, boxColor, font, sceneRef}: {
    text: string,
    radius: number,
    padding: number,
    textColor: string,
    boxColor: string,
    font: MarkerFontId,
    sceneRef: RefObject<Group>
}) {
    const boxDepth = 0.5;
    const size = 0.5;

    const loadedFont = new FontLoader().parse(FONT_DATA[font]);
    const depth = 0.1;

    // Create geometry to get bounding box
    const geometry = new TextGeometry(text, {font: loadedFont, size, depth});
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox;
    const width = bbox ? bbox.max.x - bbox.min.x : 0;
    const height = bbox ? bbox.max.y - bbox.min.y : 0;
    const yCenter = bbox ? (bbox.max.y + bbox.min.y) / 2 : 0;

    // Create the base rounded box geometry
    const baseGeometry = createBoxWithRoundedEdges(
        width + padding,
        height + padding,
        boxDepth,
        radius,
        3
    );

    // Create the subtraction box geometry
    const subtractionGeometry = new BoxGeometry(
        width + padding + 0.01,
        height,
        boxDepth / 3
    );

    // Apply transformation to the subtraction geometry
    const matrix = new Matrix4().makeTranslation(0, -(height) / 2, 0);
    subtractionGeometry.applyMatrix4(matrix);

    // Perform CSG operation
    let finalGeometry;
    try {
        const baseCSG = CSG.fromGeometry(baseGeometry);
        const subtractionCSG = CSG.fromGeometry(subtractionGeometry);
        const resultCSG = baseCSG.subtract(subtractionCSG);
        finalGeometry = CSG.toGeometry(resultCSG, new Matrix4());

        // Ensure proper normals and attributes
        finalGeometry.computeVertexNormals();
    } catch (error) {
        console.warn('CSG operation failed, falling back to base geometry:', error);
        finalGeometry = baseGeometry;
    }

    // Clean up temporary geometries
    baseGeometry.dispose();
    subtractionGeometry.dispose();

    // Clean up geometry on unmount
    useEffect(() => {
        return () => {
            if (finalGeometry) {
                finalGeometry.dispose();
            }
        };
    }, [finalGeometry]);

    return (
        <group dispose={null} ref={sceneRef}>
            <mesh receiveShadow geometry={finalGeometry}>
                <meshPhysicalMaterial
                    color={boxColor}
                    roughness={0.85}
                    metalness={0}
                    clearcoat={0.2}
                    clearcoatRoughness={0.7}
                />
            </mesh>
            <mesh castShadow position={[-width / 2, -yCenter, boxDepth / 2]}>
                <textGeometry args={[text, {font: loadedFont, size, depth, curveSegments: 4}]}/>
                <meshPhysicalMaterial
                    color={textColor}
                    roughness={0.85}
                    metalness={0}
                    clearcoat={0.2}
                    clearcoatRoughness={0.7}
                />
            </mesh>
            <mesh castShadow position={[width / 2, -yCenter, -boxDepth / 2]} rotation={[0, Math.PI, 0]}>
                <textGeometry args={[text, {font: loadedFont, size, depth, curveSegments: 4}]}/>
                <meshPhysicalMaterial
                    color={textColor}
                    roughness={0.85}
                    metalness={0}
                    clearcoat={0.2}
                    clearcoatRoughness={0.7}
                />
            </mesh>
        </group>
    );
}