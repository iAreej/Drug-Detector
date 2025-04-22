import { supabase } from '../lib/superbase';
import { createContext, PropsWithChildren, useEffect, useState } from "react"
import { Session } from "@supabase/supabase-js"
import { useContext } from "react"
type AuthData={
    session:Session|null;
    loading:boolean
    profile:any
    isAdmin:boolean
}

const AuthContext=createContext<AuthData>({
    session:null,
    loading:true,
    profile:null,
    isAdmin:false,
})
export default function AuthProvider({children}:PropsWithChildren<{}>){
const[session, setSession]=useState<Session|null>(null)
const[loading, setLoading]=useState(true)
const[profile, setProfile]=useState(null)
const[isAdmin, setAdmin]=useState(false)

useEffect(()=>{
    console.log('Auth Provider is mounted')
    const fetchSession=async()=>{
        const {data: {session}}=await supabase.auth.getSession();
        setSession(session)

        if (session) {
            // fetch profile
            const { data } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            setProfile(data || null);
          }
          setLoading(false)

    }
    fetchSession();
    supabase.auth.onAuthStateChange((_event,session)=>{
        setSession(session)
    })
},[])

    return(
        <AuthContext.Provider value={{session, loading, profile, isAdmin: profile?.group== "ADMIN",} }>
         {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>useContext(AuthContext)