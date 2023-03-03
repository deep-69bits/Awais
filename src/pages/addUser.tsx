import React, { ReactNode, useEffect } from 'react'
import { useState } from 'react'
import { mdiForwardburger, mdiBackburger, mdiMenu } from '@mdi/js'
import menuAside from '../menuAside'
import menuNavBar from '../menuNavBar'
import BaseIcon from '../components/BaseIcon'
import NavBar from '../components/NavBar'
import NavBarItemPlain from '../components/NavBarItemPlain'
import AsideMenu from '../components/AsideMenu'
import FooterBar from '../components/FooterBar'
import { setUser } from '../stores/mainSlice'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import FormField from '../components/FormField'
import { Field, Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import CardBoxClient from '../components/CardBoxClient'

type Props = {
  children: ReactNode
}

export default function LayoutAuthenticated({ children }: Props) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(
      setUser({
        name: 'John Doe',
        email: 'john@example.com',
        avatar:
          'https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93',
      })
    )
  })

  const darkMode = useAppSelector((state) => state.style.darkMode)

  const [isAsideMobileExpanded, setIsAsideMobileExpanded] = useState(false)
  const [isAsideLgActive, setIsAsideLgActive] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsAsideMobileExpanded(false)
      setIsAsideLgActive(false)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.events, dispatch])

  const layoutAsidePadding = 'xl:pl-60'

  return (
    <div className={`${darkMode ? 'dark' : ''}  bg-white overflow-hidden lg:overflow-visible`}>
      <div
        className={`${layoutAsidePadding} ${
          isAsideMobileExpanded ? '' : ''
        } pt-14 min-h-screen w-screen transition-position lg:w-auto `}
      >
        <NavBar
          menu={menuNavBar}
          className={`${layoutAsidePadding} ${isAsideMobileExpanded ?  'bg-white ' : ''}`}
          >
          <NavBarItemPlain
            display="flex lg:hidden"
            onClick={() => setIsAsideMobileExpanded(!isAsideMobileExpanded)}
          >
            <BaseIcon path={isAsideMobileExpanded ? mdiBackburger : mdiForwardburger} size="24" />
          </NavBarItemPlain>
          <NavBarItemPlain
            display="hidden lg:flex xl:hidden"
            onClick={() => setIsAsideLgActive(true)}
          >
            <BaseIcon path={mdiMenu} size="24" />
          </NavBarItemPlain>
          {/* <NavBarItemPlain useMargin>
            <Formik
              initialValues={{
                search: '',
              }}
              onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
            >
              <Form>
                <FormField isBorderless isTransparent>
                  <Field name="search" placeholder="Search" />
                </FormField>
              </Form>
            </Formik>
          </NavBarItemPlain> */}
        </NavBar>
        <AsideMenu
          isAsideMobileExpanded={isAsideMobileExpanded}
          isAsideLgActive={isAsideLgActive}
          menu={menuAside}
          onAsideLgClose={() => setIsAsideLgActive(false)}
        />
        {children}
        {/* <FooterBar>
          Get more with{` `}
          <a
            href="https://tailwind-react.justboil.me/dashboard"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600"
          >
            Premium version
          </a>
        </FooterBar> */}
       <div className='m-4'>
       

   
       <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
  <img className="h-8 w-8 rounded-full object-cover" src="https://via.placeholder.com/150" alt="Avatar"/>
  <div className="ml-4">
    <h3 className="text-sm font-medium text-gray-900">John Doe</h3>
    <p className="text-xs text-gray-500">johndoe@example.com</p>
  </div>
  <div className="ml-auto flex space-x-2">
    <button className="text-gray-500 hover:text-gray-700">
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M3.707 3.707a1 1 0 011.414 0L8 5.586l-1.293 1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0L3 7.414l-1.293 1.293a1 1 0 010-1.414l1-1a1 1 0 011.414 0L5.414 6 6 5.414l-1.293-1.293a1 1 0 010-1.414zm10.586 10.586a1 1 0 01-1.414 0L12 14.414l1.293-1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0L9 13.414l-1.293 1.293a1 1 0 01-1.414 0l-1-1a1 1 0 010-1.414L6.586 12 6 12.586l1.293 1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0zM10 7a3 3 0 110-6 3 3 0 010 6zm8-2a1 1 0 100 2h-1v7.586l-2-2V9h-4v6.586l-2-2V9H4a1 1 0 100 2h1v6.586l2 2V11h4v4.586l2-2V11h2a1 1 0 100-2h-2V8h1a1 1 0 100-2h-1V3.414l2 2V7h2z" clip-rule="evenodd" />
      </svg>
    </button>
    <button className="text-gray-500 hover:text-gray-700">
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M3.707 3.707a1 1 0 011.414 0L8 5.586l-1.293 1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0L3 7.414l-1.293 1.293a1 1 0 010-1.414l1-1a1 1 0 011.414 0L5.414 6 6 5.414l-1.293-1.293a1 1 0 010-1.414zm10.586 10.586a1 1 0 01-1.414 0L12 14.414l1.293-1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0L9 13.414l-1.293 1.293a1 1 0 01-1.414 0l-1-1a1 1 0 010-1.414L6.586 12 6 12.586l1.293 1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0zM10 7a3 3 0 110-6 3 3 0 010 6zm8-2a1 1 0 100 2h-1v7.586l-2-2V9h-4v6.586l-2-2V9H4a1 1 0 100 2h1v6.586l2 2V11h4v4.586l2-2V11h2a1 1 0 100-2h-2V8h1a1 1 0 100-2h-1V3.414l2 2V7h2z" clip-rule="evenodd" />
      </svg>
    </button>
    </div>
    </div>
    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
  <img className="h-8 w-8 rounded-full object-cover" src="https://via.placeholder.com/150" alt="Avatar"/>
  <div className="ml-4">
    <h3 className="text-sm font-medium text-gray-900">John Doe</h3>
    <p className="text-xs text-gray-500">johndoe@example.com</p>
  </div>
  <div className="ml-auto flex space-x-2">
    <button className="text-gray-500 hover:text-gray-700">
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M3.707 3.707a1 1 0 011.414 0L8 5.586l-1.293 1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0L3 7.414l-1.293 1.293a1 1 0 010-1.414l1-1a1 1 0 011.414 0L5.414 6 6 5.414l-1.293-1.293a1 1 0 010-1.414zm10.586 10.586a1 1 0 01-1.414 0L12 14.414l1.293-1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0L9 13.414l-1.293 1.293a1 1 0 01-1.414 0l-1-1a1 1 0 010-1.414L6.586 12 6 12.586l1.293 1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0zM10 7a3 3 0 110-6 3 3 0 010 6zm8-2a1 1 0 100 2h-1v7.586l-2-2V9h-4v6.586l-2-2V9H4a1 1 0 100 2h1v6.586l2 2V11h4v4.586l2-2V11h2a1 1 0 100-2h-2V8h1a1 1 0 100-2h-1V3.414l2 2V7h2z" clip-rule="evenodd" />
      </svg>
    </button>
    <button className="text-gray-500 hover:text-gray-700">
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M3.707 3.707a1 1 0 011.414 0L8 5.586l-1.293 1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0L3 7.414l-1.293 1.293a1 1 0 010-1.414l1-1a1 1 0 011.414 0L5.414 6 6 5.414l-1.293-1.293a1 1 0 010-1.414zm10.586 10.586a1 1 0 01-1.414 0L12 14.414l1.293-1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0L9 13.414l-1.293 1.293a1 1 0 01-1.414 0l-1-1a1 1 0 010-1.414L6.586 12 6 12.586l1.293 1.293a1 1 0 010 1.414l-1 1a1 1 0 01-1.414 0zM10 7a3 3 0 110-6 3 3 0 010 6zm8-2a1 1 0 100 2h-1v7.586l-2-2V9h-4v6.586l-2-2V9H4a1 1 0 100 2h1v6.586l2 2V11h4v4.586l2-2V11h2a1 1 0 100-2h-2V8h1a1 1 0 100-2h-1V3.414l2 2V7h2z" clip-rule="evenodd" />
      </svg>
    </button>
    </div>
    </div>
    
    




       

       </div>
      </div>
    </div>
  )
}
