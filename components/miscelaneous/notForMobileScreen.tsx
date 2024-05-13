export default function NotForMobileScreen(){
    return (
        <div className="fixed z-[1000] w-screen h-screen flex flex-col gap-2 items-center justify-center bg-neutral-100 md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path d="M176,16H80A24,24,0,0,0,56,40V216a24,24,0,0,0,24,24h96a24,24,0,0,0,24-24V40A24,24,0,0,0,176,16ZM72,64H184V192H72Zm8-32h96a8,8,0,0,1,8,8v8H72V40A8,8,0,0,1,80,32Zm96,192H80a8,8,0,0,1-8-8v-8H184v8A8,8,0,0,1,176,224Z"></path></svg>
            <p className="max-w-64 text-balance text-center text-sm font-semibold text-neutral-900 cursor-default">The app is not available for mobile devices</p>
        </div>
    )
};