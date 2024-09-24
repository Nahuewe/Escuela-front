import React from 'react'
import { Link } from 'react-router-dom'
import useWidth from '@/hooks/useWidth'

import LogoEdja from '@/assets/images/logo/logo_edja.png'
const Logo = () => {
  const { width, breakpoints } = useWidth()

  return (
    <div>
      <Link to='/afiliados'>
        {width >= breakpoints.xl
          ? (
            <img src={LogoEdja} alt='' className='w-32 rounded-md' />
            )
          : (
            <img src={LogoEdja} alt='' className='w-32 rounded-md' />
            )}
      </Link>
    </div>
  )
}

export default Logo
