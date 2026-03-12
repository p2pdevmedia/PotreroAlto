import { selectRows } from '@/lib/supabase';
import { mapSubsectorRows } from '@/lib/supabase-models';

const POTRERO_ALTO_SECTOR_ID = '6574670919';

export async function getPotreroAltoData() {
  const sectorRows = await selectRows('sectors', {
    select: 'id,name,location,description',
    id: `eq.${POTRERO_ALTO_SECTOR_ID}`,
    limit: '1'
  });

  if (!sectorRows?.length) {
    throw new Error('No existe el sector Potrero Alto en Supabase. Ejecutá la migración SQL inicial.');
  }

  const [subsectorRows, routeRows] = await Promise.all([
    selectRows('subsectors', {
      select: 'id,sector_id,name,sector,description,image,sort_order',
      sector_id: `eq.${POTRERO_ALTO_SECTOR_ID}`,
      order: 'sort_order.asc,name.asc'
    }),
    selectRows('routes', {
      select:
        'id,subsector_id,name,grade,stars,type,description,image,length_meters,quickdraws,equipped_by,equipped_date,first_ascent_by,first_ascent_date,latitude,longitude,sort_order',
      sector_id: `eq.${POTRERO_ALTO_SECTOR_ID}`,
      order: 'sort_order.asc,name.asc'
    })
  ]);

  const sector = sectorRows[0];

  return {
    id: sector.id,
    name: sector.name,
    location: sector.location,
    description: sector.description ?? '',
    subsectors: mapSubsectorRows(subsectorRows ?? [], routeRows ?? []),
    isFallback: false
  };
}
