import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import ReactGridLayout, {
  Layout,
  Layouts,
  Responsive,
  WidthProvider,
} from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface IGraphEditorItem extends Layout {
  data: any;
  id: string | number;
}

const GraphEditorCanvas = () => {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<IGraphEditorItem[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateDOM = () => {
    const dom = _.map(items, (l, i) => {
      return (
        <div
          key={i}
          className={l.static ? 'static' : ''}
          style={{ background: '#000', color: '#FFF' }}>
          {JSON.stringify(l.data)}
        </div>
      );
    });
    console.log('DOM ', dom);
    return dom;
  };

  const onDrop = (layout: any, layoutItem: any) => {
    alert(
      `Dropped element props:\n${JSON.stringify(
        layoutItem,
        ['x', 'y', 'w', 'h'],
        2,
      )}`,
    );
  };

  const onDragStop = (data: any, foo: any, bar: any, star: any) => {
    console.log('ITEMS: ', data);
    console.log('foo: ', foo);
    console.log('bar: ', bar);
    console.log('star: ', star);
  };

  const onLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    const newLayout: IGraphEditorItem[] = currentLayout.map((l, index) => {
      return {
        ...l,
        id: index,
        w: 2,
        h: 2,
        data: {},
      };
    });

    console.log({ currentLayout, allLayouts });

    setItems(newLayout);
  };

  return (
    <ResponsiveReactGridLayout
      className={'layout'}
      cols={{ lg: 8, md: 8, sm: 8, xs: 8, xxs: 8 }}
      layouts={{ lg: items }}
      onDrop={onDrop}
      onLayoutChange={onLayoutChange}
      measureBeforeMount={false}
      useCSSTransforms={mounted}
      isResizable={false}
      rowHeight={10}
      margin={[50, 50]}
      onDragStop={onDragStop}
      compactType={null}
      preventCollision={false}
      isDroppable={true}>
      {generateDOM()}
    </ResponsiveReactGridLayout>
  );
};

const generateLayout = () => {
  let x = 0;
  let y = 0;
  return _.map(_.range(0, 25), (item, i) => {
    const data: IGraphEditorItem = {
      x,
      y,
      w: 2,
      h: 2,
      data: {},
      id: i,
      i: i.toString(),
      static: false,
    };

    x += 2;

    if (x >= 8) {
      y += 1;
      x = 0;
    }

    return data;
  });
};

export default GraphEditorCanvas;
