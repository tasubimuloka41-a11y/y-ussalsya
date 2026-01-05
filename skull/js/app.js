const scene = new THREE.Scene();
const container = document.querySelector(".container");
// Камера

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

camera.position.set(0, 0, -50);
camera.lookAt(0, 0, 0);

// Холст

const canvas = document.querySelector(".webgl");

// Рендерер

const renderer = new THREE.WebGLRenderer({
  альфа: истина,
  сглаживание: true,
  холст: холст,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Элементы управления

// const controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.enableZoom = false;

// Изменение размера

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Загрузчик

пусть модель;

const loader = new THREE.GLTFLoader();

loader.load("https://raw.githubusercontent.com/huseynovvusal/skull/main/model/scene.gltf", (gltf) => {
  canvas.classList.add("webgl-active");
  container.classList.add("hidden");
  model = gltf.scene;
  model.scale.set(15, 15, 15);
  scene.add(model);
  animate();
});

// Свет

const pointLight1 = PointLight(0xff0050, 5, 5, 5);
scene.add(pointLight1);

const pointLight2 = PointLight(0xffff50, 5, 5, 5);
scene.add(pointLight2);

function PointLight(color, x, y, z) {
  const pointLight = new THREE.PointLight(color, 20);
  pointLight.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 8),
      new THREE.MeshBasicMaterial({ color: color })
    )
  );
  pointLight.position.set(x, y, z);

  return pointLight;
}

// Вспомогательные функции

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper);

// const AxesHelper = new THREE.AxesHelper(50);
// scene.add(AxesHelper);

// Анимировать

document.addEventListener("mousemove", skullOnMouseMove);

пусть targetX = 0;
пусть targetY = 0;

function skullOnMouseMove(e) {
  targetX = (e.clientX - window.innerWidth / 2) * 0.001;
  targetY = (e.clientY - window.innerHeight / 2) * 0.001;
}

const clock = new THREE.Clock();

const animate = () => {
  // Анимация вращения черепа

  const elapsedTime = clock.getElapsedTime();
  model.rotation.y = 0.7 * elapsedTime;

  model.rotation.y += 0.5 * (targetX - model.rotation.y);
  model.rotation.x += 0.5 * (targetY - model.rotation.x);

  // Анимация освещения

  const time = Date.now() * 0.005;

  pointLight1.position.x = Math.sin(time * 0.8) * 20;
  pointLight1.position.y = Math.cos(time * 0.6) * 30;

  pointLight2.position.x = Math.sin(time * -0.8) * 20;
  pointLight2.position.y = Math.cos(time * -0.6) * 30;

  requestAnimationFrame(animate);
  // controls.update();
  renderer.render(scene, camera);
};

animate();
