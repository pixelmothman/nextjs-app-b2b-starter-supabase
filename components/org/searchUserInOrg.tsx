"use client"

export default function SearchUserInOrg({userSearchState, emailSearch}: {userSearchState:string, emailSearch: any}){
    return (
        <div 
        className='w-96 h-fit flex flex-row items-center py-2 px-2 gap-1 bg-neutral-100 text-xs font-semibold text-neutral-800 border border-neutral-300 outline-0 rounded-sm'
        aria-label="Search for a user in the organization"
        >
            <div className='w-full flex flex-row items-center gap-2'>
                <input 
                required
                value={userSearchState}
                onChange={(e) => {
                    emailSearch(e.target.value);
                }}
                autoComplete='off'
                type='text' 
                id='userSearch'
                name='userSearch'
                min={3}
                max={50}
                className='w-full h-fit p-0 bg-neutral-100 text-xs font-normal text-neutral-800 outline-0'
                />
                <label htmlFor='userSearch' className='text-xs font-normal text-neutral-800'>
                    <svg className='fill-neutral-900' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z"></path></svg>
                </label>
            </div>
        </div>
    )
}