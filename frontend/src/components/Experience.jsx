import { Environment, Html, OrbitControls, useTexture, Gltf, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Avatar } from "./Avatar";
import { useState } from "react";
import { George } from "./George";
import { Note } from "./Note";

export const Experience = ({ rotation }) => {
  const [status, setStatus] = useState("Connecting...")
  const texture = useTexture("textures/botton-only.png");
  const viewport = useThree((state) => state.viewport);


  return (
    <>
      <OrbitControls
        enableZoom={false} enableRotate={false}
      />
      <Html position={[0,2.7,0]}>
        <div className="status-box">
          {status}
        </div>
      </Html>
      <George position={[-0.1, -1.85, 0]} scale={1.49999999999999999999999} setStatus={setStatus}/>
      <Note position={[-0.1, -1.5, 0]} scale={1.49999999999999999999999}/>
      <Environment preset="sunset" />
      <mesh scale={1}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </>
  );
};

