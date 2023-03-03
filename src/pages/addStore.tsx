import React, { ReactNode, useEffect } from 'react'
import { useState } from 'react'
import { mdiForwardburger, mdiBackburger, mdiMenu } from '@mdi/js'
import menuAside from '../menuAside'
import menuNavBar from '../menuNavBar'
import BaseIcon from '../components/BaseIcon'
import NavBar from '../components/NavBar'
import NavBarItemPlain from '../components/NavBarItemPlain'
import AsideMenu from '../components/AsideMenu'
import { setUser } from '../stores/mainSlice'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import { useRouter } from 'next/router'
import Table from 'react-bootstrap/Table';
import DateFilter from "../components/DateFilter"

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
       <div className='m-8'>
       

<div>


</div>

    <Table striped className='border shadow' responsive hover size="sm">
      <thead >
        <tr className='border shadow' style={{fontSize:"14px",fontWeight:"bold"}} >
          
          
          <th className='border shadow'>West Code</th>
          <th className='border shadow'>Customer ID</th>
          <th className='border shadow'>Street</th>
          <th className='border shadow'>City</th>
          <th className='border shadow'>Chain</th>
          
<th className='border shadow'></th>

        </tr>
      </thead>
      <tbody>
        <tr className='shadow ' style={{fontSize:"12px"}}>
          
          
        <td className='border shadow'>1234</td>
        <td className='border shadow'>15503265</td>
        <td className='border shadow'>Old River Bridge Ola</td>
        <td className='border shadow'>Athens</td>
        <td>SAOPPA AOLE</td>
        <td></td>
      
        


        </tr>
        <tr className='shadow ' style={{fontSize:"12px"}}>
          
          
          <td className='border shadow'>1234</td>
          <td className='border shadow'>15503265</td>
          <td className='border shadow'>Old River Bridge Ola</td>
          <td className='border shadow'>Athens</td>
          <td>SAOPPA AOLE</td>
          <td></td>
        
          
  
  
          </tr> <tr className='shadow ' style={{fontSize:"12px"}}>
          
          
          <td className='border shadow'>1234</td>
          <td className='border shadow'>15503265</td>
          <td className='border shadow'>Old River Bridge Ola</td>
          <td className='border shadow'>Athens</td>
          <td>SAOPPA AOLE</td>
          <td></td>
        
          
  
  
          </tr> <tr className='shadow ' style={{fontSize:"12px"}}>
          
          
          <td className='border shadow'>1234</td>
          <td className='border shadow'>15503265</td>
          <td className='border shadow'>Old River Bridge Ola</td>
          <td className='border shadow'>Athens</td>
          <td>SAOPPA AOLE</td>
          <td></td>
        
          
  
  
          </tr>
       
        

       
      </tbody>
    </Table>




       

       </div>
      </div>
    </div>
  )
}
