import React, { useEffect, useRef, useState } from 'react'
import { useFrame, useGraph } from '@react-three/fiber'
import { Html, useAnimations, useFBX, useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import { Listing } from '../services/listing'
import * as THREE from "three";
import { welcome } from '../../constants/welcome'


const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

const morphTargetSmoothing = 0.5;
const smoothMorphTarget = true;

export function George(props) {
  const [audioPlay, setAudioPlay] = useState(false);
  const [animation, setAnimation] = useState("Idle");
  const [start, setStart] = useState(false);
  const group = useRef();

  const { scene } = useGLTF('/models/1bill_george.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone);





  const audioRef = useRef(null);
  const lipsyncRef = useRef([]);
  const listingRef = useRef(null);


  const handlePlayAudio = async (src, data, type = "ongoing") => {
    if (audioRef.current) audioRef.current.pause();
    audioRef.current = new Audio(src);
    lipsyncRef.current = data;

    audioRef.current.play().then(() => console.log("Audio played!"))
      .catch(err => console.log("Error playing audio:", err?.message || err));


    props.setStatus("Speaking...");


    audioRef.current.addEventListener("ended", () => {
      setAudioPlay(false);
      audioRef.current = null;
      lipsyncRef.current = [];
      props.setStatus("Listening...");

      Object.values(corresponding).forEach((value) => {
        if (!smoothMorphTarget) {
          nodes.george_washington.morphTargetInfluences[
            nodes.george_washington.morphTargetDictionary[value]
          ] = 0;
          nodes.george_3D_model004.morphTargetInfluences[
            nodes.george_3D_model004.morphTargetDictionary[value]
          ] = 0;
        } else {
          nodes.george_washington.morphTargetInfluences[
            nodes.george_washington.morphTargetDictionary[value]
          ] = THREE.MathUtils.lerp(
            nodes.george_washington.morphTargetInfluences[
            nodes.george_washington.morphTargetDictionary[value]
            ],
            0,
            morphTargetSmoothing
          );

          nodes.george_3D_model004.morphTargetInfluences[
            nodes.george_3D_model004.morphTargetDictionary[value]
          ] = THREE.MathUtils.lerp(
            nodes.george_3D_model004.morphTargetInfluences[
            nodes.george_3D_model004.morphTargetDictionary[value]
            ],
            0,
            morphTargetSmoothing
          );


          
        }
      });
    });
  };


  const handleIntrupt = async () => {
    if (audioRef.current) {
      console.log("stop")
      audioRef.current.pause();
      audioRef.current = null;
      lipsyncRef.current = [];
      setAudioPlay(false);
      props.setStatus("Listening...");

      Object.values(corresponding).forEach((value) => {
        if (!smoothMorphTarget) {
          nodes.george_washington.morphTargetInfluences[
            nodes.george_washington.morphTargetDictionary[value]
          ] = 0;
          nodes.george_3D_model004.morphTargetInfluences[
            nodes.george_3D_model004.morphTargetDictionary[value]
          ] = 0;
        } else {
          nodes.george_washington.morphTargetInfluences[
            nodes.george_washington.morphTargetDictionary[value]
          ] = THREE.MathUtils.lerp(
            nodes.george_washington.morphTargetInfluences[
            nodes.george_washington.morphTargetDictionary[value]
            ],
            0,
            morphTargetSmoothing
          );

          nodes.george_3D_model004.morphTargetInfluences[
            nodes.george_3D_model004.morphTargetDictionary[value]
          ] = THREE.MathUtils.lerp(
            nodes.george_3D_model004.morphTargetInfluences[
            nodes.george_3D_model004.morphTargetDictionary[value]
            ],
            0,
            morphTargetSmoothing
          );

          
        }
      });

    }
  }



  useFrame(() => {
    if (!audioRef.current) return
    const currentAudioTime = audioRef.current.currentTime;
    if (audioRef.current.paused || audioRef.current.ended) {
      // setAnimation("Idle");
      return;
    }

    Object.values(corresponding).forEach((value) => {
      if (!smoothMorphTarget) {
        nodes.george_washington.morphTargetInfluences[
          nodes.george_washington.morphTargetDictionary[value]
        ] = 0;
        nodes.george_3D_model004.morphTargetInfluences[
          nodes.george_3D_model004.morphTargetDictionary[value]
        ] = 0;
      } else {
        nodes.george_washington.morphTargetInfluences[
          nodes.george_washington.morphTargetDictionary[value]
        ] = THREE.MathUtils.lerp(
          nodes.george_washington.morphTargetInfluences[
          nodes.george_washington.morphTargetDictionary[value]
          ],
          0,
          morphTargetSmoothing
        );

        nodes.george_3D_model004.morphTargetInfluences[
          nodes.george_3D_model004.morphTargetDictionary[value]
        ] = THREE.MathUtils.lerp(
          nodes.george_3D_model004.morphTargetInfluences[
          nodes.george_3D_model004.morphTargetDictionary[value]
          ],
          0,
          morphTargetSmoothing
        );

        
      }
    });

    for (let i = 0; i < lipsyncRef.current.length; i++) {
      const mouthCue = lipsyncRef.current[i];
      if (
        currentAudioTime >= mouthCue.start &&
        currentAudioTime <= mouthCue.end
      ) {
        if (!smoothMorphTarget) {
          nodes.george_washington.morphTargetInfluences[
            nodes.george_washington.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
          ] = 1;
          nodes.george_3D_model004.morphTargetInfluences[
            nodes.george_3D_model004.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
          ] = 1;
        } else {
          nodes.george_washington.morphTargetInfluences[
            nodes.george_washington.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
          ] = THREE.MathUtils.lerp(
            nodes.george_washington.morphTargetInfluences[
            nodes.george_washington.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
            ],
            1,
            morphTargetSmoothing
          );
          nodes.george_3D_model004.morphTargetInfluences[
            nodes.george_3D_model004.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
          ] = THREE.MathUtils.lerp(
            nodes.george_3D_model004.morphTargetInfluences[
            nodes.george_3D_model004.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
            ],
            1,
            morphTargetSmoothing
          );
          
        }

        break;
      }
    }
  });

  useEffect(() => {
    if (listingRef.current) return;
    listingRef.current = new Listing(handlePlayAudio, handleIntrupt, props.setStatus);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      const leftBlinkIndex = nodes.george_washington.morphTargetDictionary["left_eye_blink"];
      const rightBlinkIndex = nodes.george_washington.morphTargetDictionary["right_eye_blink"];
      const leftBlinkIndex1 = nodes.george_3D_model004.morphTargetDictionary["left_eye_blink"];
      const rightBlinkIndex1 = nodes.george_3D_model004.morphTargetDictionary["right_eye_blink"];

      if (leftBlinkIndex !== undefined && rightBlinkIndex !== undefined) {
        nodes.george_washington.morphTargetInfluences[leftBlinkIndex] = 1;
        nodes.george_washington.morphTargetInfluences[rightBlinkIndex] = 1;

        nodes.george_3D_model004.morphTargetInfluences[leftBlinkIndex1] = 1;
        nodes.george_3D_model004.morphTargetInfluences[rightBlinkIndex1] = 1;


        // Then reset after a short time to simulate blink (like 100ms)
        setTimeout(() => {
          nodes.george_washington.morphTargetInfluences[leftBlinkIndex] = 0;
          nodes.george_washington.morphTargetInfluences[rightBlinkIndex] = 0;

          nodes.george_3D_model004.morphTargetInfluences[leftBlinkIndex1] = 0;
          nodes.george_3D_model004.morphTargetInfluences[rightBlinkIndex1] = 0;
        }, 50);
      }
    }, 5000); // blink every 5 seconds

    return () => clearInterval(interval);
  }, []);


  return (
    <>
      {
        !start &&
        <Html position={[0, -2.5, 0]}>
          <button onClick={() => { setStart(true); handlePlayAudio(welcome.src, welcome.data, "intial_message") }} style={{ borderRadius: "5px", background: "red", color: "white", border: "none", cursor: "pointer", padding: "8px 15px" }}>Start</button>
        </Html>
      }
      <group {...props} dispose={null}>
        <group position={[0.015, 0.032, 0.844]} rotation={[0, 0.323, 0]}>
          <primitive object={nodes.Bone} />
          <skinnedMesh name="george_washington" geometry={nodes.george_washington.geometry} material={materials.george} skeleton={nodes.george_washington.skeleton} morphTargetDictionary={nodes.george_washington.morphTargetDictionary} morphTargetInfluences={nodes.george_washington.morphTargetInfluences} />
          <skinnedMesh name="george_3D_model004" geometry={nodes.george_3D_model004.geometry} material={materials['george_face.001']} skeleton={nodes.george_3D_model004.skeleton} morphTargetDictionary={nodes.george_3D_model004.morphTargetDictionary} morphTargetInfluences={nodes.george_3D_model004.morphTargetInfluences} />
          <skinnedMesh name="george_3D_model004_1" geometry={nodes.george_3D_model004_1.geometry} material={materials['george_face_2.001']} skeleton={nodes.george_3D_model004_1.skeleton} morphTargetDictionary={nodes.george_3D_model004_1.morphTargetDictionary} morphTargetInfluences={nodes.george_3D_model004_1.morphTargetInfluences} />
          <skinnedMesh name="george_3D_model004_2" geometry={nodes.george_3D_model004_2.geometry} material={materials['george_clothe_1.001']} skeleton={nodes.george_3D_model004_2.skeleton} morphTargetDictionary={nodes.george_3D_model004_2.morphTargetDictionary} morphTargetInfluences={nodes.george_3D_model004_2.morphTargetInfluences} />
          <skinnedMesh name="george_3D_model004_3" geometry={nodes.george_3D_model004_3.geometry} material={materials['george_clothe_2.001']} skeleton={nodes.george_3D_model004_3.skeleton} morphTargetDictionary={nodes.george_3D_model004_3.morphTargetDictionary} morphTargetInfluences={nodes.george_3D_model004_3.morphTargetInfluences} />
          <skinnedMesh name="george_3D_model004_4" geometry={nodes.george_3D_model004_4.geometry} material={materials['george_hair.001']} skeleton={nodes.george_3D_model004_4.skeleton} morphTargetDictionary={nodes.george_3D_model004_4.morphTargetDictionary} morphTargetInfluences={nodes.george_3D_model004_4.morphTargetInfluences} />
        </group>
      </group>
    </>
  )
}

useGLTF.preload('/models/1bill_george.glb')
