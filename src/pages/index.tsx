import {RefObject, useRef, useState} from 'react';
import {
    Button,
    Card,
    ColorArea,
    ColorPicker,
    ColorSlider,
    ColorSwatch,
    Input,
    Label,
    ListBox,
    Select,
    Slider,
    TextField,
} from "@heroui/react";
import {MarkerDisplay} from "@/components/MarkerDisplay";
import {STLExporter} from "three/examples/jsm/exporters/STLExporter";
import {Group} from "three";
import {MARKER_FONTS, MarkerFontId} from "@/lib/marker-fonts";

const exporter = new STLExporter();

function downloadSTL(text: string, scene: RefObject<Group>) {
    scene.current.scale.set(20, 20, 20);
    scene.current.updateMatrixWorld(true);

    const blob = new Blob([exporter.parse(scene.current)], {type: 'application/octet-stream'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${text}.stl`;
    link.click();
    scene.current.scale.set(1, 1, 1);
}

function MarkerColorPicker({label, color, onChange}: {
    label: string;
    color: string;
    onChange: (color: string) => void;
}) {
    return (
        <ColorPicker value={color} onChange={(c) => onChange(c.toString("hex"))}>
            <ColorPicker.Trigger className="rounded-xl px-2 py-1.5">
                <ColorSwatch size="lg"/>
                <Label>{label}</Label>
            </ColorPicker.Trigger>
            <ColorPicker.Popover>
                <ColorArea
                    aria-label={`${label} area`}
                    className="max-w-full"
                    colorSpace="hsb"
                    xChannel="saturation"
                    yChannel="brightness"
                >
                    <ColorArea.Thumb/>
                </ColorArea>
                <ColorSlider aria-label={`${label} hue`} channel="hue" className="gap-1 px-1" colorSpace="hsb">
                    <ColorSlider.Track>
                        <ColorSlider.Thumb/>
                    </ColorSlider.Track>
                </ColorSlider>
            </ColorPicker.Popover>
        </ColorPicker>
    );
}

function FontSelect({font, onChange}: {
    font: MarkerFontId;
    onChange: (font: MarkerFontId) => void;
}) {
    const selected = MARKER_FONTS.find((f) => f.id === font);

    return (
        <Select
            aria-label="Marker font"
            value={font}
            variant="secondary"
            onChange={(value) => onChange(value as MarkerFontId)}
        >
            <Label>Font</Label>
            <Select.Trigger>
                <Select.Value className={selected?.className}>
                    {selected?.label}
                </Select.Value>
                <Select.Indicator/>
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {MARKER_FONTS.map((f) => (
                        <ListBox.Item key={f.id} id={f.id} className={f.className} textValue={f.label}>
                            {f.label}
                            <ListBox.ItemIndicator/>
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
    );
}

export default function Home() {
    const [text, setText] = useState("Strahd von Zarovich");
    const [boxColor, setBoxColor] = useState("#0000ff");
    const [textColor, setTextColor] = useState("#ffffff");
    const [radius, setRadius] = useState(0.8);
    const [padding, setPadding] = useState(0.5);
    const [font, setFont] = useState<MarkerFontId>("chewy");

    const sceneRef = useRef<Group>(null!);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 p-4 md:flex-row md:items-start md:p-8">
                <Card className="overflow-hidden p-0 md:flex-1">
                    <MarkerDisplay text={text}
                                   radius={radius / 10}
                                   padding={padding}
                                   boxColor={boxColor}
                                   textColor={textColor}
                                   font={font}
                                   sceneRef={sceneRef}/>
                </Card>

                <Card className="flex w-full flex-col gap-6 md:w-[360px]">
                    <Card.Header>
                        <Card.Title>Initiative Marker</Card.Title>
                        <Card.Description>
                            Customize your marker, then export it as a 3D-printable STL.
                        </Card.Description>
                    </Card.Header>

                    <Card.Content className="flex flex-col gap-5">
                        <TextField name="text" value={text} onChange={setText} variant="secondary">
                            <Label>Marker text</Label>
                            <Input placeholder="Enter name" variant="secondary"/>
                        </TextField>

                        <FontSelect font={font} onChange={setFont}/>

                        <Slider value={radius} onChange={(v) => setRadius(v as number)} minValue={0.1}
                                maxValue={2} step={0.1}>
                            <Label>Corner smoothing</Label>
                            <Slider.Output/>
                            <Slider.Track>
                                <Slider.Fill/>
                                <Slider.Thumb/>
                            </Slider.Track>
                        </Slider>

                        <Slider value={padding} onChange={(v) => setPadding(v as number)} minValue={0.1}
                                maxValue={2} step={0.1}>
                            <Label>Padding</Label>
                            <Slider.Output/>
                            <Slider.Track>
                                <Slider.Fill/>
                                <Slider.Thumb/>
                            </Slider.Track>
                        </Slider>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex gap-4">
                                <MarkerColorPicker label="Box color" color={boxColor} onChange={setBoxColor}/>
                                <MarkerColorPicker label="Text color" color={textColor} onChange={setTextColor}/>
                            </div>
                            <p className="text-xs text-muted">Colors are for preview only. Re-apply colors in your slicer if you have a multi-color printer.</p>
                        </div>
                    </Card.Content>

                    <Card.Footer>
                        <Button className="w-full" onPress={() => downloadSTL(text, sceneRef)}>
                            Download STL
                        </Button>
                    </Card.Footer>
                </Card>
            </div>
        </main>
    );
}
