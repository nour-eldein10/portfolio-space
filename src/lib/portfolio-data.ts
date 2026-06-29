import portrait from "@/assets/portrait.jpg";
import appPulse from "@/assets/app-pulse.jpg";
import appLedger from "@/assets/app-ledger.jpg";
import appStill from "@/assets/app-still.jpg";
import design1 from "@/assets/design-1.jpg";
import design2 from "@/assets/design-2.jpg";
import design3 from "@/assets/design-3.jpg";

export const profile = {
  name: "Nour Eldein",
  handle: "@noureldein",
  location: "Mansoura, EG · Remote",
  email: "Noureldein1100@gmail.com",
  primaryRole: "Growth Engineer",
  rotatingRoles: [
    "Growth Engineer",
    "Flutter Developer",
    "Automation Developer",
    "Graphic Designer",
    "Product Builder",
  ],
  bio: "Building software, automation systems, and digital experiences that help businesses grow and innovate.",
  portrait,
  available: true,
};

export const stats = [
  { label: "Apps shipped", value: 14 },
  { label: "Automation flows", value: 60 },
  { label: "Active users reached", value: "120K+" },
  { label: "Years building", value: 6 },
];

/* ───────── Tech stack for marquee ───────── */

export const techStack = [
  { name: "Flutter", icon: "M14.314 0L2.3 12 6 15.7 21.684.013h-7.357zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z" },
  { name: "Dart", icon: "M4.105 4.105S9.158 1.58 11.684.316a3.079 3.079 0 0 1 1.481-.315c.766.047 1.677.788 1.677.788L24 9.948v9.789h-4.263V24H9.789l-9-9C.303 14.5 0 13.795 0 13.105c0-.319.18-.818.316-1.105l3.789-7.895zm.679.679v11.787c.002.543.021 1.024.498 1.508L10.204 23h8.533v-4.263L4.784 4.784zm12.055-.678c-.899-.896-1.809-1.78-2.74-2.643-.302-.267-.567-.468-1.07-.462-.37.014-.87.195-.87.195L6.341 4.105l10.498.001z" },
  { name: "Firebase", icon: "M19.455 8.369c-.538-.748-1.778-2.285-3.681-4.569-.826-.991-1.535-1.832-1.884-2.245a146 146 0 0 0-.488-.576l-.207-.245-.113-.133-.022-.032-.01-.005L12.57 0l-.609.488c-1.555 1.246-2.828 2.851-3.681 4.64-.523 1.064-.864 2.105-1.043 3.176-.047.241-.088.489-.121.738-.209-.017-.421-.028-.632-.033-.018-.001-.035-.002-.059-.003a7.46 7.46 0 0 0-2.28.274l-.317.089-.163.286c-.765 1.342-1.198 2.869-1.252 4.416-.07 2.01.477 3.954 1.583 5.625 1.082 1.633 2.61 2.882 4.42 3.611l.236.095.071.025.003-.001a9.59 9.59 0 0 0 2.941.568q.171.006.342.006c1.273 0 2.513-.249 3.69-.742l.008.004.313-.145a9.63 9.63 0 0 0 3.927-3.335c1.01-1.49 1.577-3.234 1.641-5.042.075-2.161-.643-4.304-2.133-6.371m-7.083 6.695c.328 1.244.264 2.44-.191 3.558-1.135-1.12-1.967-2.352-2.475-3.665-.543-1.404-.87-2.74-.974-3.975.48.157.922.366 1.315.622 1.132.737 1.914 1.902 2.325 3.461zm.207 6.022c.482.368.99.712 1.513 1.028-.771.21-1.565.302-2.369.273a8 8 0 0 1-.373-.022c.458-.394.869-.823 1.228-1.279zm1.347-6.431c-.516-1.957-1.527-3.437-3.002-4.398-.647-.421-1.385-.741-2.194-.95.011-.134.026-.268.043-.4.014-.113.03-.216.046-.313.133-.689.332-1.37.589-2.025.099-.25.206-.499.321-.74l.004-.008c.177-.358.376-.719.61-1.105l.092-.152-.003-.001c.544-.851 1.197-1.627 1.942-2.311l.288.341c.672.796 1.304 1.548 1.878 2.237 1.291 1.549 2.966 3.583 3.612 4.48 1.277 1.771 1.893 3.579 1.83 5.375-.049 1.395-.461 2.755-1.195 3.933-.694 1.116-1.661 2.05-2.8 2.708-.636-.318-1.559-.839-2.539-1.599.79-1.575.952-3.28.479-5.072zm-2.575 5.397c-.725.939-1.587 1.55-2.09 1.856-.081-.029-.163-.06-.243-.093l-.065-.026c-1.49-.616-2.747-1.656-3.635-3.01-.907-1.384-1.356-2.993-1.298-4.653.041-1.19.338-2.327.882-3.379.316-.07.638-.114.96-.131l.084-.002c.162-.003.324-.003.478 0 .227.011.454.035.677.07.073 1.513.445 3.145 1.105 4.852.637 1.644 1.694 3.162 3.144 4.515z" },
  { name: "VS Code", icon: "M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" },
  { name: "Android Studio", icon: "M19.2693 10.3368c-.3321 0-.6026.2705-.6026.6031v9.8324h-1.7379l-3.3355-6.9396c.476-.5387.6797-1.286.5243-2.0009a2.2862 2.2862 0 0 0-1.2893-1.6248v-.8124c.0121-.2871-.1426-.5787-.4043-.7407-.1391-.0825-.2884-.1234-.4402-.1234a.8478.8478 0 0 0-.4318.1182c-.2701.1671-.4248.4587-.4123.7662l-.0003.721c-1.0149.3668-1.6619 1.4153-1.4867 2.5197a2.282 2.282 0 0 0 .5916 1.2103l-3.2096 6.9064H4.0928c-1.0949-.007-1.9797-.8948-1.9832-1.9896V5.016c-.0055 1.1024.8836 2.0006 1.9859 2.0062a2.024 2.024 0 0 0 .1326-.0037h14.7453s2.5343-.2189 2.8619 1.5392c-.2491.0287-.4449.2321-.4449.4889 0 .7115-.5791 1.2901-1.3028 1.2901h-.8183zM17.222 22.5366c.2347.4837.0329 1.066-.4507 1.3007-.1296.0629-.2666.0895-.4018.0927a.9738.9738 0 0 1-.3194-.0455c-.024-.0078-.046-.0209-.0694-.0305a.9701.9701 0 0 1-.2277-.1321c-.0247-.0192-.0495-.038-.0724-.0598-.0825-.0783-.1574-.1672-.21-.2757l-1.2554-2.6143-1.5585-3.2452a.7725.7725 0 0 0-.6995-.4443h-.0024a.792.792 0 0 0-.7083.4443l-1.5109 3.2452-1.2321 2.6464a.9722.9722 0 0 1-.7985.5795c-.0626.0053-.1238-.0024-.185-.0087-.0344-.0036-.069-.0053-.1025-.0124-.0489-.0103-.0954-.0278-.142-.0452-.0301-.0113-.0613-.0197-.0901-.0339-.0496-.0244-.0948-.0565-.1397-.0889-.0217-.0156-.0457-.0275-.0662-.045a.9862.9862 0 0 1-.1695-.1844.9788.9788 0 0 1-.0708-.9852l.8469-1.8223 3.2676-7.0314a1.7964 1.7964 0 0 1-.7072-1.1637c-.1555-.9799.5129-1.9003 1.4928-2.0559V9.3946a.3542.3542 0 0 1 .1674-.3155.3468.3468 0 0 1 .3541 0 .354.354 0 0 1 .1674.3155v1.159l.0129.0064a1.8028 1.8028 0 0 1 1.2878 1.378 1.7835 1.7835 0 0 1-.6439 1.7836l3.3889 7.0507.8481 1.7643zM12.9841 12.306c.0042-.6081-.4854-1.1044-1.0935-1.1085a1.1204 1.1204 0 0 0-.7856.3219 1.101 1.101 0 0 0-.323.7716c-.0042.6081.4854 1.1044 1.0935 1.1085h.0077c.6046 0 1.0967-.488 1.1009-1.0935zm-1.027 5.2768c-.1119.0005-.2121.0632-.2571.1553l-1.4127 3.0342h3.3733l-1.4564-3.0328a.274.274 0 0 0-.2471-.1567zm8.1432-6.7459l-.0129-.0001h-.8177a.103.103 0 0 0-.103.103v12.9103a.103.103 0 0 0 .0966.103h.8435c.9861-.0035 1.7836-.804 1.7836-1.79V9.0468c0 .9887-.8014 1.7901-1.7901 1.7901zM2.6098 5.0161v.019c.0039.816.6719 1.483 1.4874 1.4869a12.061 12.061 0 0 1 .1309-.0034h1.1286c.1972-1.315.7607-2.525 1.638-3.4859H4.0993c-.9266.0031-1.6971.6401-1.9191 1.4975.2417.0355.4296.235.4296.4859zm6.3381-2.8977L7.9112.3284a.219.219 0 0 1 0-.2189A.2384.2384 0 0 1 8.098 0a.219.219 0 0 1 .1867.1094l1.0496 1.8158a6.4907 6.4907 0 0 1 5.3186 0L15.696.1094a.2189.2189 0 0 1 .3734.2189l-1.0302 1.79c1.6671.9125 2.7974 2.5439 3.0975 4.4018l-12.286-.0014c.3004-1.8572 1.4305-3.488 3.0972-4.4003zm5.3774 2.6202a.515.515 0 0 0 .5271.5028.515.515 0 0 0 .5151-.5151.5213.5213 0 0 0-.8885-.367.5151.5151 0 0 0-.1537.3793zm-5.7178-.0067a.5151.5151 0 0 0 .5207.5095.5086.5086 0 0 0 .367-.1481.5215.5215 0 1 0-.734-.7341.515.515 0 0 0-.1537.3727z" },
  { name: "GitHub", icon: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
  { name: "Figma", icon: "M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z" },
  { name: "Photoshop", icon: "M9.85 8.42c-.37-.15-.77-.21-1.18-.2-.26 0-.49 0-.68.01-.2-.01-.34 0-.41.01v3.36c.14.01.27.02.39.02h.53c.39 0 .78-.06 1.15-.18.32-.09.6-.28.82-.53.21-.25.31-.59.31-1.03.01-.31-.07-.62-.23-.89-.17-.26-.41-.46-.7-.57zM19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.899c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zm-7.391 11.65c-.399.56-.959.98-1.609 1.22-.68.25-1.43.34-2.25.34-.24 0-.4 0-.5-.01s-.24-.01-.43-.01v3.209c.01.07-.04.131-.11.141H5.52c-.08 0-.12-.041-.12-.131V6.42c0-.07.03-.11.1-.11.17 0 .33 0 .56-.01.24-.01.49-.01.76-.02s.56-.01.87-.02c.31-.01.61-.01.91-.01.82 0 1.5.1 2.06.31.5.17.96.45 1.34.82.32.32.57.71.73 1.14.149.42.229.85.229 1.3.001.86-.199 1.57-.6 2.13zm7.091 3.89c-.28.4-.671.709-1.12.891-.49.209-1.09.318-1.811.318-.459 0-.91-.039-1.359-.129-.35-.061-.7-.17-1.02-.32-.07-.039-.121-.109-.111-.189v-1.74c0-.029.011-.07.041-.09.029-.02.06-.01.09.01.39.23.8.391 1.24.49.379.1.779.15 1.18.15.38 0 .65-.051.83-.141.16-.07.27-.24.27-.42 0-.141-.08-.27-.24-.4-.16-.129-.489-.279-.979-.471-.51-.18-.979-.42-1.42-.719-.31-.221-.569-.51-.761-.85-.159-.32-.239-.67-.229-1.021 0-.43.12-.84.341-1.21.25-.4.619-.72 1.049-.92.469-.239 1.059-.349 1.769-.349.41 0 .83.03 1.24.09.3.04.59.12.86.23.039.01.08.05.1.09.01.04.02.08.02.12v1.63c0 .04-.02.08-.05.1-.09.02-.14.02-.18 0-.3-.16-.62-.27-.96-.34-.37-.08-.74-.13-1.12-.13-.2-.01-.41.02-.601.07-.129.03-.24.1-.31.2-.05.08-.08.18-.08.27s.04.18.101.26c.09.11.209.2.34.27.229.12.47.23.709.33.541.18 1.061.43 1.541.73.33.209.6.49.789.83.16.318.24.67.23 1.029.011.471-.129.94-.389 1.331z" },
  { name: "Illustrator", icon: "M10.53 10.73c-.1-.31-.19-.61-.29-.92-.1-.31-.19-.6-.27-.89-.08-.28-.15-.54-.22-.78h-.02c-.09.43-.2.86-.34 1.29-.15.48-.3.98-.46 1.48-.14.51-.29.98-.44 1.4h2.54c-.06-.211-.14-.46-.23-.721-.09-.269-.18-.559-.27-.859zM19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.9c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zM14.7 16.83h-2.091c-.069.01-.139-.04-.159-.11l-.82-2.38H7.91l-.76 2.35c-.02.09-.1.15-.19.141H5.08c-.11 0-.14-.061-.11-.18L8.19 7.38c.03-.1.06-.21.1-.33.04-.21.06-.43.06-.65-.01-.05.03-.1.08-.11h2.59c.08 0 .12.03.13.08l3.65 10.3c.03.109 0 .16-.1.16zm3.4-.15c0 .11-.039.16-.129.16H16.01c-.1 0-.15-.061-.15-.16v-7.7c0-.1.041-.14.131-.14h1.98c.09 0 .129.05.129.14v7.7zm-.209-9.03c-.231.24-.571.37-.911.35-.33.01-.65-.12-.891-.35-.23-.25-.35-.58-.34-.92-.01-.34.12-.66.359-.89.242-.23.562-.35.892-.35.391 0 .689.12.91.35.22.24.34.56.33.89.01.34-.11.67-.349.92z" },
  { name: "Unity", icon: "m12.9288 4.2939 3.7997 2.1929c.1366.077.1415.2905 0 .3675l-4.515 2.6076a.4192.4192 0 0 1-.4246 0L7.274 6.8543c-.139-.0745-.1415-.293 0-.3675l3.7972-2.193V0L1.3758 5.5977V16.793l3.7177-2.1456v-4.3858c-.0025-.1565.1813-.2682.318-.1838l-4.5148-2.6076c-.1366-.0781-.1415-.2905 0-.3676v-5.2127c-.0025-.1565.1813-.2682.3179-.1838l3.7996 2.1929 3.7178-2.1457L12 24l9.6954-5.5977-3.7178-2.1457-3.7996 2.1929c-.1341.082-.3229-.0248-.3179-.1838V13.053c0-.1565.087-.2956.2136-.3676l4.5149-2.6076c.134-.082.3228.0224.3179.1838v4.3858l3.7177 2.1456V5.5977L12.9288 0Z" },
  { name: "JavaScript", icon: "M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" },
  { name: "HTML", icon: "M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z" },
  { name: "CSS", icon: "M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z" },
];

export const marqueeWords = [
  "Flutter",
  "Dart",
  "Firebase",
  "Figma",
  "Automation",
  "Growth",
  "Design",
  "Product",
];

/* ───────── Organizations ───────── */

export const organizations = [
  { name: "Zoomin", type: "Company" },
  { name: "Mostaqal", type: "Platform" },
  { name: "Growfet", type: "Startup" },
  { name: "Refqaa", type: "Volunteer" },
  { name: "Bionic Team", type: "Team" },
  { name: "Mega Team", type: "Team" },
  { name: "Matrix Team", type: "Team" },
  { name: "Sonaa IT", type: "Company" },
  { name: "NASA Space Apps", type: "Competition" },
  { name: "Rowad", type: "Organization" },
];

/* ───────── Services ───────── */

export const services = [
  {
    n: "01",
    title: "Flutter App Development",
    body: "Cross-platform mobile apps with native polish — design systems, offline-first state, App Store / Play Store delivery.",
    tags: ["Flutter", "Dart", "Firebase", "Riverpod"],
    features: ["Custom UI/UX", "API Integration", "Push Notifications", "In-App Purchases"],
    timeline: "4-12 weeks",
    pricing: "Starting from $2,000",
  },
  {
    n: "02",
    title: "Business Automation",
    body: "Internal tools, scrapers, n8n / Make graphs, custom Python bots that quietly run a business.",
    tags: ["n8n", "Python", "Playwright", "Webhooks"],
    features: ["Workflow Automation", "Data Scraping", "Bot Development", "API Pipelines"],
    timeline: "2-6 weeks",
    pricing: "Starting from $1,500",
  },
  {
    n: "03",
    title: "Graphic & Brand Design",
    body: "Identity systems, app icons, posters and product visuals. Type-led, restrained, photographic.",
    tags: ["Figma", "Illustrator", "Type", "Motion"],
    features: ["Logo Design", "Brand Guidelines", "Marketing Materials", "Social Media Assets"],
    timeline: "1-4 weeks",
    pricing: "Starting from $800",
  },
  {
    n: "04",
    title: "UI/UX Design",
    body: "Beautiful, user-centered interfaces that convert visitors and delight users at every touchpoint.",
    tags: ["Figma", "Prototyping", "User Research", "Design Systems"],
    features: ["Wireframing", "Prototyping", "Design Systems", "Usability Testing"],
    timeline: "2-6 weeks",
    pricing: "Starting from $1,200",
  },
  {
    n: "05",
    title: "Custom Software",
    body: "Full-stack web solutions, dashboards, SaaS MVPs — from idea to launch with clean architecture.",
    tags: ["React", "Node.js", "Supabase", "Vercel"],
    features: ["Web Apps", "Admin Dashboards", "SaaS Platforms", "REST/GraphQL APIs"],
    timeline: "6-16 weeks",
    pricing: "Starting from $3,000",
  },
  {
    n: "06",
    title: "Consultation",
    body: "Strategic advice on product, tech stack, growth engineering and automation. One-on-one sessions.",
    tags: ["Strategy", "Growth", "Architecture", "Review"],
    features: ["Tech Stack Review", "Architecture Planning", "Growth Strategy", "Code Review"],
    timeline: "Per session",
    pricing: "Starting from $100/hr",
  },
];

export const featuredProjects = [
  {
    id: "pulse",
    name: "Pulse — habit OS",
    year: 2025,
    role: "Lead mobile + brand",
    summary: "A daily habits app that learns your rhythm. 38k MAU, 4.8★ App Store.",
    cover: appPulse,
    accent: "neon",
    category: "apps",
  },
  {
    id: "ledger",
    name: "Ledger Black",
    year: 2025,
    role: "Mobile + automation",
    summary: "Private finance dashboard with automated bank reconciliation pipelines.",
    cover: appLedger,
    accent: "neon",
    category: "apps",
  },
  {
    id: "still",
    name: "Still — focus timer",
    year: 2024,
    role: "Product + design",
    summary: "A meditation-paced focus app. Featured by Apple in 11 countries.",
    cover: appStill,
    accent: "amber",
    category: "apps",
  },
];

export const apps = [
  {
    id: "pulse",
    name: "Pulse",
    tagline: "Daily habits, learned.",
    icon: "◐",
    rating: 4.8,
    reviews: "2.1k",
    downloads: "120k+",
    category: "Health · Productivity",
    accent: "neon",
    cover: appPulse,
  },
  {
    id: "ledger",
    name: "Ledger Black",
    tagline: "Private money, public clarity.",
    icon: "◼",
    rating: 4.7,
    reviews: "812",
    downloads: "24k+",
    category: "Finance",
    accent: "neon",
    cover: appLedger,
  },
  {
    id: "still",
    name: "Still",
    tagline: "A timer that breathes with you.",
    icon: "◯",
    rating: 4.9,
    reviews: "5.4k",
    downloads: "210k+",
    category: "Mindfulness",
    accent: "amber",
    cover: appStill,
  },
];

export const designs = [
  { id: "d1", title: "Halftone — identity system", category: "Branding", cover: design1 },
  { id: "d2", title: "Spectra — editorial spread", category: "Editorial", cover: design2 },
  { id: "d3", title: "Lanture — logo suite", category: "Logos", cover: design3 },
];

/* ───────── Experience tabs ───────── */

export const workExperience = [
  {
    role: "Mobile Developer",
    company: "8shiver",
    period: "2024 — Present",
    location: "Remote",
    highlights: [
      "Building cross-platform mobile app from 0 to 1",
      "Owns product roadmap + design system",
      "Flutter, Firebase, Riverpod",
    ],
  },
  {
    role: "Automation Engineer",
    company: "Freelance",
    period: "2022 — Present",
    location: "Remote",
    highlights: [
      "60+ automation flows shipped",
      "n8n / Make / Python pipelines",
      "Saved clients 200+ hrs / month",
    ],
  },
  {
    role: "Graphic Designer",
    company: "Self-employed",
    period: "2020 — Present",
    location: "Mansoura, EG",
    highlights: [
      "Brand systems for 20+ startups",
      "App icons, posters, motion",
      "Figma / Illustrator / After Effects",
    ],
  },
  {
    role: "Product Engineer",
    company: "Ledger Black",
    period: "2023 — 2024",
    location: "Remote",
    highlights: [
      "Led mobile + automation stack",
      "Bank reconciliation pipeline",
      "24k+ downloads in 6 months",
    ],
  },
];

export const volunteerExperience = [
  {
    role: "Technical Lead",
    company: "Refqaa",
    period: "2023 — Present",
    location: "Mansoura, EG",
    highlights: [
      "Led technical team of 8 members",
      "Built internal management tools",
      "Organized tech workshops",
    ],
  },
  {
    role: "Design Lead",
    company: "Bionic Team",
    period: "2022 — 2023",
    location: "Mansoura, EG",
    highlights: [
      "Designed all team branding materials",
      "Created social media campaigns",
      "Mentored junior designers",
    ],
  },
];

export const internships = [
  {
    role: "Flutter Intern",
    company: "Sonaa IT",
    period: "2022",
    location: "Remote",
    highlights: [
      "Built 3 production features",
      "Learned enterprise Flutter patterns",
      "Contributed to CI/CD pipeline",
    ],
  },
  {
    role: "Design Intern",
    company: "Growfet",
    period: "2021",
    location: "Remote",
    highlights: [
      "Created UI components library",
      "Designed onboarding flow",
      "User research interviews",
    ],
  },
];

export const leadership = [
  {
    role: "Team Lead",
    company: "Mega Team",
    period: "2023 — Present",
    location: "Mansoura, EG",
    highlights: [
      "Leading cross-functional team of 12",
      "Sprint planning and retrospectives",
      "Delivered 4 successful projects",
    ],
  },
  {
    role: "Co-Founder",
    company: "Matrix Team",
    period: "2022 — 2023",
    location: "Mansoura, EG",
    highlights: [
      "Founded competitive programming team",
      "Organized local hackathons",
      "Grew community to 50+ members",
    ],
  },
];

// Backward compat
export const experiences = workExperience;

/* ───────── Skills ───────── */

export const skills = {
  Development: [
    { name: "Flutter / Dart", level: 95 },
    { name: "JavaScript / TypeScript", level: 80 },
    { name: "Python", level: 75 },
    { name: "Firebase", level: 90 },
    { name: "React", level: 70 },
    { name: "HTML / CSS", level: 85 },
  ],
  Design: [
    { name: "Figma", level: 92 },
    { name: "Adobe Photoshop", level: 85 },
    { name: "Adobe Illustrator", level: 88 },
    { name: "UI/UX Design", level: 80 },
    { name: "Motion Design", level: 65 },
  ],
  Automation: [
    { name: "n8n", level: 90 },
    { name: "Make (Integromat)", level: 85 },
    { name: "Python Bots", level: 80 },
    { name: "Web Scraping", level: 85 },
    { name: "API Integration", level: 90 },
  ],
  Marketing: [
    { name: "Growth Hacking", level: 75 },
    { name: "SEO", level: 70 },
    { name: "Content Strategy", level: 72 },
    { name: "Analytics", level: 78 },
  ],
  Leadership: [
    { name: "Team Management", level: 85 },
    { name: "Project Planning", level: 80 },
    { name: "Mentoring", level: 82 },
    { name: "Agile/Scrum", level: 78 },
  ],
  "Soft Skills": [
    { name: "Communication", level: 88 },
    { name: "Problem Solving", level: 92 },
    { name: "Time Management", level: 80 },
    { name: "Adaptability", level: 85 },
  ],
};

/* ───────── Certificates ───────── */

export const certificates = [
  {
    id: "cert-1",
    title: "Flutter Advanced Course",
    issuer: "Udemy",
    date: "2024",
    image: appPulse,
  },
  {
    id: "cert-2",
    title: "Google UX Design",
    issuer: "Google / Coursera",
    date: "2023",
    image: appLedger,
  },
  {
    id: "cert-3",
    title: "Python Automation",
    issuer: "Automate the Boring Stuff",
    date: "2023",
    image: appStill,
  },
  {
    id: "cert-4",
    title: "NASA Space Apps",
    issuer: "NASA",
    date: "2023",
    image: design1,
  },
  {
    id: "cert-5",
    title: "Firebase Fundamentals",
    issuer: "Google",
    date: "2022",
    image: design2,
  },
];

/* ───────── Volunteering ───────── */

export const volunteering = [
  {
    id: "vol-refqaa",
    organization: "Refqaa",
    role: "Technical Lead",
    period: "2023 — Present",
    description: "Community-driven organization focused on youth empowerment and tech education.",
    achievements: [
      "Led a team of 8 developers",
      "Built internal tools for 500+ members",
      "Organized 10+ tech workshops",
    ],
    responsibilities: ["Technical strategy", "Team recruitment", "Workshop planning"],
  },
  {
    id: "vol-bionic",
    organization: "Bionic Team",
    role: "Design Lead",
    period: "2022 — 2023",
    description: "Student engineering team building competitive robots and automation systems.",
    achievements: [
      "Designed complete brand identity",
      "Created team website",
      "Won regional design award",
    ],
    responsibilities: ["Brand design", "Social media", "Graphic design"],
  },
  {
    id: "vol-mega",
    organization: "Mega Team",
    role: "Team Lead",
    period: "2023 — Present",
    description: "Cross-functional technology team working on innovative software projects.",
    achievements: [
      "Delivered 4 successful projects",
      "Grew team from 5 to 12",
      "Established agile workflow",
    ],
    responsibilities: ["Sprint management", "Code review", "Architecture decisions"],
  },
  {
    id: "vol-matrix",
    organization: "Matrix Team",
    role: "Co-Founder",
    period: "2022 — 2023",
    description: "Competitive programming community focused on algorithms and problem-solving.",
    achievements: [
      "Grew community to 50+ members",
      "Organized 3 hackathons",
      "Members placed in ICPC",
    ],
    responsibilities: ["Community building", "Event planning", "Problem setting"],
  },
  {
    id: "vol-sonaa",
    organization: "Sonaa IT",
    role: "Volunteer Developer",
    period: "2022",
    description: "IT company providing pro-bono development for non-profit organizations.",
    achievements: [
      "Built 2 charity apps",
      "Trained 5 junior developers",
      "Improved deployment pipeline",
    ],
    responsibilities: ["Mobile development", "Code mentoring", "QA testing"],
  },
];

export const reviews = [
  {
    quote:
      "Nour shipped our v1 in six weeks. The app feels like it was made by a studio three times our size.",
    author: "Layla H.",
    role: "Founder, Pulse Health",
  },
  {
    quote: "Half developer, half designer, half operator — and somehow that adds up. Rare hire.",
    author: "Mostafa K.",
    role: "CTO, Ledger Black",
  },
  {
    quote: "The automation work paid for itself in the first month. He thinks in systems.",
    author: "Sara M.",
    role: "Ops Lead, Still",
  },
];
