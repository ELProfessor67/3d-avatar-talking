import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Loader } from "@react-three/drei";
import { useState, useRef } from "react";

function App() {
  const [start, setStart] = useState(false);
  const [avatarRotation, setAvatarRotation] = useState([0, 0, 0]);
  const [isRotating, setIsRotating] = useState(false);
  const lastRotation = useRef(0); // Store last rotation value

  const handleMouseMove = (event) => {
    if (!isRotating) return;

    const { clientX, target } = event;
    const { width } = target.getBoundingClientRect();

    const rotationY = lastRotation.current + ((clientX / width) - 0.5) * Math.PI;
    setAvatarRotation([0, rotationY, 0]);
  };

  const handleMouseDown = () => {
    setIsRotating(true);
  };

  const handleMouseUp = () => {
    setIsRotating(false);
    lastRotation.current = avatarRotation[1];
  };
  // if (!start) {
  //   return <>
  //     <div className="main-box">
  //       <button onClick={() => setStart(true)}>START</button>
  //     </div>
  //   </>
  // }
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ width: "100vw", height: "100vh" }}
    >
      <Loader />
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }} gl={{ preserveDrawingBuffer: true }}>
        <color attach="background" args={["#ececec"]} />
        <Experience rotation={avatarRotation} />
      </Canvas>
    </div>
  );
}

export default App;
