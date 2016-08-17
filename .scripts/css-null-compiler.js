/**
 * Created by josh.welham on 17/08/16.
 */

const noop = () =>
{
  return null;
};

require.extensions['.styl'] = noop;
require.extensions['.scss'] = noop;
require.extensions['.png'] = noop;
require.extensions['.css'] = noop;
