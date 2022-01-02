function render 
  ( p_dynamic_action in apex_plugin.t_dynamic_action
  , p_plugin         in apex_plugin.t_plugin 
  )
return apex_plugin.t_dynamic_action_render_result
as
    l_result     apex_plugin.t_dynamic_action_render_result;
    
    -- Custom attributes
    l_attribute1 p_dynamic_action.attribute_01%type := p_dynamic_action.attribute_01;
    l_attribute2 p_dynamic_action.attribute_02%type := p_dynamic_action.attribute_02;
    l_attribute3 p_dynamic_action.attribute_03%type := p_dynamic_action.attribute_03;

begin
    
    -- Debug
    if apex_application.g_debug 
    then
        apex_plugin_util.debug_dynamic_action
          ( p_plugin         => p_plugin
          , p_dynamic_action => p_dynamic_action
          );
    end if;

    -- Load javascript
    APEX_JAVASCRIPT.ADD_LIBRARY(
        P_NAME                   => 'js/ir',
        P_CHECK_TO_ADD_MINIFIED  => TRUE,
        P_DIRECTORY              => P_PLUGIN.FILE_PREFIX,
        P_KEY                    => 'com.madmexx.iru.ir'
    );
    
    -- Call the function with the specific region id
    l_result.javascript_function := 'function(){
            caller($(this)[0].action.affectedRegionId,"' || l_attribute1 || '","' || l_attribute2 || '","' || l_attribute3 || '");
        }';

    return l_result;
    
end render;