
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
const blick_every_second = 2;
const blin_off_is_second = 0.4;





export function Avatar(props) {
  const [audioPlay, setAudioPlay] = useState(false);
  const [start, setStart] = useState(false);
  // Idle_1,idle_2,Nod_no,Nod_yes,Talking
  const [animation, setAnimation] = useState("Idle_1");



  const group = React.useRef();
  const { scene, animations } = useGLTF('/models/george.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions } = useAnimations(animations, group);



  const audioRef = useRef(null);
  const lipsyncRef = useRef([]);
  const listingRef = useRef(null);


  const handlePlayAudio = async (src, data, type = "ongoing") => {
    if (audioRef.current) audioRef.current.pause();

    lipsyncRef.current = data;
    const audio = new Audio(src);
    audioRef.current = audio;

    // Wait for audio to be ready before playing
    const playAudio = () => {
      audio.play().then(() => {
        console.log("Audio played!");
        setAudioPlay(true);
        setAnimation("Talking");
        props.setStatus("Speaking...");
      }).catch(err => {
        console.log("Error playing audio:", err?.message || err);
      });
    };

    // Ensures metadata is loaded first
    audio.addEventListener('loadedmetadata', playAudio);

    // Clean up on end
    audio.addEventListener("ended", () => {
      setAudioPlay(false);
      audioRef.current = null;
      lipsyncRef.current = [];
      setAnimation("Idle_1");
      props.setStatus("Listening...");

      Object.values(corresponding).forEach((value) => {
        const index = nodes.george_washington.morphTargetDictionary[value];
        if (!smoothMorphTarget) {
          nodes.george_washington.morphTargetInfluences[index] = 0;
        } else {
          nodes.george_washington.morphTargetInfluences[index] = THREE.MathUtils.lerp(
            nodes.george_washington.morphTargetInfluences[index],
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

        }
      });

    }
  }

  


  useFrame(() => {
    if (!audioRef.current) return
    const currentAudioTime = audioRef.current.currentTime;
    if (audioRef.current.paused || audioRef.current.ended) {
      setAnimation("Idle_1")
      return;
    }

    Object.values(corresponding).forEach((value) => {
      if (!smoothMorphTarget) {
        nodes.george_washington.morphTargetInfluences[
          nodes.george_washington.morphTargetDictionary[value]
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
        }

        break;
      }
    }
  });



  

  const handleStart = () => {
    handlePlayAudio(welcome.src, welcome.data, "intial_message")
    if (!listingRef.current) {
      listingRef.current = new Listing(handlePlayAudio, handleIntrupt, props.setStatus);
    }
    setStart(true);
  }


  useEffect(() => {
    let interval;

    const startBlinking = () => {
      const randomInterval = (blick_every_second + (Math.random() * 2 - 1)) * 1000; // add randomness ±1s

      interval = setTimeout(() => {
        const leftBlinkIndex = nodes.george_washington.morphTargetDictionary["left_eye_blink"];
        const rightBlinkIndex = nodes.george_washington.morphTargetDictionary["right_eye_blink"];

        if (leftBlinkIndex !== undefined && rightBlinkIndex !== undefined) {
          nodes.george_washington.morphTargetInfluences[leftBlinkIndex] = 1;
          nodes.george_washington.morphTargetInfluences[rightBlinkIndex] = 1;

          setTimeout(() => {
            nodes.george_washington.morphTargetInfluences[leftBlinkIndex] = 0;
            nodes.george_washington.morphTargetInfluences[rightBlinkIndex] = 0;

            // Schedule the next blink
            startBlinking();
          }, blin_off_is_second * 1000);
        } else {
          // In case morph targets are missing, retry later
          startBlinking();
        }
      }, randomInterval);
    };

    startBlinking();

    return () => clearTimeout(interval);
  }, []);

  useEffect(() => {
    console.log(animation, "animation")
    if (actions[animation]) {
      actions[animation].reset().setEffectiveTimeScale(0.5).fadeIn(0.3).play()
    }
  }, [actions, animation, animations]);
  return (
    <>
      {
        !start &&
        <Html position={[0, -2.5, 0]}>
          <button onClick={handleStart} style={{ borderRadius: "5px", background: "red", color: "white", border: "none", cursor: "pointer", padding: "8px 15px" }}>Start</button>
        </Html>
      }
      <group ref={group} {...props} dispose={null}>
        <group name="Scene">
          <group name="Armature" rotation={[0, 0.323, 0]}>
            <primitive object={nodes.Neck} />
            <skinnedMesh name="george_washington" geometry={nodes.george_washington.geometry} material={materials.george} skeleton={nodes.george_washington.skeleton} morphTargetDictionary={nodes.george_washington.morphTargetDictionary} morphTargetInfluences={nodes.george_washington.morphTargetInfluences} />
          </group>
        </group>
      </group>
    </>
  )
}

useGLTF.preload('/models/george.glb')
