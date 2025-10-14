'use client'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import { Inventory } from '@/payload-types'
import { InventoryDrawer } from './drawer'

interface InventoryItemCellProps {
  item: Inventory
}

export function InventoryItemCell({ item }: InventoryItemCellProps) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.itemType}
        </Button>
      </DrawerTrigger>
      <DrawerContent className={isMobile ? '' : 'w-[400px] sm:w-[540px]'}>
        <DrawerHeader>
          <DrawerTitle className='text-2xl'>Item Details</DrawerTitle>
          {/* <DrawerDescription>Serial: {item.serialNumber}</DrawerDescription> */}
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <InventoryDrawer item={item} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
