import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import domine from "../../public/fonts/Domine_Regular.json";
import fingerPaint from "../../public/fonts/FingerPaint_Regular.json";
import chewy from "../../public/fonts/Chewy_Regular.json";
import {extend} from "@react-three/fiber";
import {BoxGeometry, Group, Matrix4, Shape, ExtrudeGeometry} from "three";
import React, {RefObject, useEffect, useMemo} from "react";
import {CSG} from "three-csg-ts";

extend({TextGeometry})

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

export function InitiativeMarker({text, radius, padding, textColor, boxColor, sceneRef}: {
    text: string,
    radius: number,
    padding: number,
    textColor: string,
    boxColor: string,
    sceneRef: RefObject<Group>
}) {
    const boxDepth = 0.5;
    const size = 0.5;

    const {font, depth, width, yCenter, finalGeometry} = useMemo(() => {
        const font = new FontLoader().parse(chewy);
        const depth = 0.1;

        // Create geometry to get bounding box
        const geometry = new TextGeometry(text, {font, size, depth});
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

        return {font, depth, width, yCenter, finalGeometry};
    }, [radius, padding, text]);

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
                <textGeometry args={[text, {font, size, depth, curveSegments: 4}]}/>
                <meshPhysicalMaterial
                    color={textColor}
                    roughness={0.85}
                    metalness={0}
                    clearcoat={0.2}
                    clearcoatRoughness={0.7}
                />
            </mesh>
            <mesh castShadow position={[width / 2, -yCenter, -boxDepth / 2]} rotation={[0, Math.PI, 0]}>
                <textGeometry args={[text, {font, size, depth, curveSegments: 4}]}/>
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