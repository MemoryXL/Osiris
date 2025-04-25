u8R"(
$.Osiris = (function () {
  var activeTab;
  var activeSubTab = {};

  return {
    rootPanel: (function () {
      const rootPanel = $.CreatePanel('Panel', $.GetContextPanel(), 'OsirisMenuTab', {
        class: "mainmenu-content__container",
        useglobalcontext: "true"
      });

      rootPanel.visible = false;
      rootPanel.SetReadyForDisplay(false);
      rootPanel.RegisterForReadyEvents(true);
      $.RegisterEventHandler('PropertyTransitionEnd', rootPanel, function (panelName, propertyName) {
        if (rootPanel.id === panelName && propertyName === 'opacity') {
          if (rootPanel.visible === true && rootPanel.BIsTransparent()) {
            rootPanel.visible = false;
            rootPanel.SetReadyForDisplay(false);
            return true;
          } else if (newPanel.visible === true) {
            $.DispatchEvent('MainMenuTabShown', 'OsirisMenuTab');
          }
        }
        return false;
      });

      return rootPanel;
    })(),
    goHome: function () {
      $.DispatchEvent('Activated', this.rootPanel.GetParent().GetParent().GetParent().FindChildInLayoutFile("MainMenuNavBarHome"), 'mouse');
    },
    addCommand: function (command, value = '') {
      var existingCommands = this.rootPanel.GetAttributeString('cmd', '');
      this.rootPanel.SetAttributeString('cmd', existingCommands + command + ' ' + value);
    },
    navigateToTab: function (tabID) {
      if (activeTab === tabID)
        return;

      if (activeTab) {
        var panelToHide = this.rootPanel.FindChildInLayoutFile(activeTab);
        panelToHide.RemoveClass('Active');
      }

      this.rootPanel.FindChildInLayoutFile(tabID + '_button').checked = true;

      activeTab = tabID;
      var activePanel = this.rootPanel.FindChildInLayoutFile(tabID);
      activePanel.AddClass('Active');
      activePanel.visible = true;
      activePanel.SetReadyForDisplay(true);
    },
    navigateToSubTab: function (tabID, subTabID) {
      if (activeSubTab[tabID] === subTabID)
        return;

      if (activeSubTab[tabID]) {
        var panelToHide = this.rootPanel.FindChildInLayoutFile(activeSubTab[tabID]);
        panelToHide.RemoveClass('Active');
      }

      this.rootPanel.FindChildInLayoutFile(subTabID + '_button').checked = true;

      activeSubTab[tabID] = subTabID;
      var activePanel = this.rootPanel.FindChildInLayoutFile(subTabID);
      activePanel.AddClass('Active');
      activePanel.visible = true;
      activePanel.SetReadyForDisplay(true);
    },
    dropDownUpdated: function (tabID, dropDownID) {
      this.addCommand('set', tabID + '/' + dropDownID + '/' + this.rootPanel.FindChildInLayoutFile(dropDownID).GetSelected().GetAttributeString('value', ''));
    }
  };
})();

(function () {
  var createNavbar = function () {
    var navbar = $.CreatePanel('Panel', $.Osiris.rootPanel, '', {
      class: "content-navbar__tabs content-navbar__tabs--noflow"
    });

    var leftContainer = $.CreatePanel('Panel', navbar, '', {
      style: "horizontal-align: left; flow-children: right; height: 100%; margin-left: 15px;"
    });

    var activeCfgNameLabel = $.CreatePanel('Label', leftContainer, 'ActiveConfigName', {
      text: "default.cfg"
    });

    activeCfgNameLabel.SetPanelEvent('onmouseover', function () { UiToolkitAPI.ShowTextTooltip('ActiveConfigName', '当前配置文件（更改会自动保存）【Translated by MemoryXL】'); });
    activeCfgNameLabel.SetPanelEvent('onmouseout', function () { UiToolkitAPI.HideTextTooltip(); });

    var restoreDefaultsButton = $.CreatePanel('Button', leftContainer, 'RestoreDefaultsButton', {
      class: "content-navbar__tabs__btn",
      style: "margin-left: 5px;",
      onactivate: "UiToolkitAPI.ShowGenericPopupOneOptionCustomCancelBgStyle('恢复默认值', '你确定要恢复当前配置文件为默认设置吗 (default.cfg)?', '', '确认', function() { $.Osiris.addCommand('restore_defaults'); }, '取消', function() {}, 'dim');"
    });

    restoreDefaultsButton.SetPanelEvent('onmouseover', function () { UiToolkitAPI.ShowTextTooltip('RestoreDefaultsButton', 'Restore defaults'); });
    restoreDefaultsButton.SetPanelEvent('onmouseout', function () { UiToolkitAPI.HideTextTooltip(); });

    $.CreatePanel('Image', restoreDefaultsButton, '', {
      src: "s2r://panorama/images/icons/ui/recent.vsvg",
      texturewidth: "24"
    });

    var centerContainer = $.CreatePanel('Panel', navbar, '', {
      class: "content-navbar__tabs__center-container",
    });

    var hudTabButton = $.CreatePanel('RadioButton', centerContainer, 'hud_button', {
      group: "SettingsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToTab('hud');"
    });

    $.CreatePanel('Label', hudTabButton, '', { text: "HUD" });

    var visualsTabButton = $.CreatePanel('RadioButton', centerContainer, 'visuals_button', {
      group: "SettingsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToTab('visuals');"
    });

    $.CreatePanel('Label', visualsTabButton, '', { text: "视觉类" });

    var soundTabButton = $.CreatePanel('RadioButton', centerContainer, 'sound_button', {
      group: "SettingsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToTab('sound');"
    });

    $.CreatePanel('Label', soundTabButton, '', { text: "声音类" });

    var rightContainer = $.CreatePanel('Panel', navbar, '', {
      style: "horizontal-align: right; flow-children: right; height: 100%; margin-right: 70px;"
    });

    var unloadButton = $.CreatePanel('Button', rightContainer, 'UnloadButton', {
      class: "content-navbar__tabs__btn",
      onactivate: "UiToolkitAPI.ShowGenericPopupOneOptionCustomCancelBgStyle('卸载 Osiris', '你确定你要卸载 Osiris?【Translated by MemoryXL】', '', '确认', function() { $.Osiris.goHome(); $.Osiris.addCommand('unload'); }, '取消', function() {}, 'dim');"
    });

    unloadButton.SetPanelEvent('onmouseover', function () { UiToolkitAPI.ShowTextTooltip('UnloadButton', 'Unload'); });
    unloadButton.SetPanelEvent('onmouseout', function () { UiToolkitAPI.HideTextTooltip(); });

    $.CreatePanel('Image', unloadButton, '', {
      src: "s2r://panorama/images/icons/ui/cancel.vsvg",
      texturewidth: "24",
      class: "negativeColor"
    });
  };

  var createVisualsNavbar = function () {
    var navbar = $.CreatePanel('Panel', $.Osiris.rootPanel.FindChildInLayoutFile('visuals'), '', {
      class: "content-navbar__tabs content-navbar__tabs--dark content-navbar__tabs--noflow"
    });

    var centerContainer = $.CreatePanel('Panel', navbar, '', {
      class: "content-navbar__tabs__center-container",
    });

    var playerInfoTabButton = $.CreatePanel('RadioButton', centerContainer, 'player_info_button', {
      group: "VisualsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToSubTab('visuals', 'player_info');"
    });

    $.CreatePanel('Label', playerInfoTabButton, '', { text: "玩家信息" });

    var outlineGlowTabButton = $.CreatePanel('RadioButton', centerContainer, 'outline_glow_button', {
      group: "VisualsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToSubTab('visuals', 'outline_glow');"
    });

    $.CreatePanel('Label', outlineGlowTabButton, '', { text: "轮廓发光" });

    var modelGlowTabButton = $.CreatePanel('RadioButton', centerContainer, 'model_glow_button', {
      group: "VisualsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToSubTab('visuals', 'model_glow');"
    });

    $.CreatePanel('Label', modelGlowTabButton, '', { text: "模型发光" });
  };

  createNavbar();

  var settingContent = $.CreatePanel('Panel', $.Osiris.rootPanel, 'SettingsMenuContent', {
    class: "full-width full-height"
  });

  var createTab = function (tabName) {
    var tab = $.CreatePanel('Panel', settingContent, tabName, {
      useglobalcontext: "true",
      class: "SettingsMenuTab"
    });

    var content = $.CreatePanel('Panel', tab, '', {
      class: "SettingsMenuTabContent vscroll"
    });

    return content;
  };

  var createVisualsTab = function () {
    var tab = $.CreatePanel('Panel', settingContent, 'visuals', {
      useglobalcontext: "true",
      class: "SettingsMenuTab"
    });

    createVisualsNavbar();

    var content = $.CreatePanel('Panel', tab, '', {
      class: "full-width full-height"
    });

    return content;
  };

  var createSubTab = function (tab, subTabName) {
    var subTab = $.CreatePanel('Panel', tab, subTabName, {
      useglobalcontext: "true",
      class: "SettingsMenuTab"
    });

    var content = $.CreatePanel('Panel', subTab, '', {
      class: "SettingsMenuTabContent vscroll"
    });
    return content;
  };

  var createSection = function (tab, sectionName) {
    var background = $.CreatePanel('Panel', tab, '', {
      class: "SettingsBackground"
    });

    var titleContainer = $.CreatePanel('Panel', background, '', {
      class: "SettingsSectionTitleContianer"
    });

    $.CreatePanel('Label', titleContainer, '', {
      class: "SettingsSectionTitleLabel",
      text: sectionName
    });

    var content = $.CreatePanel('Panel', background, '', {
      class: "top-bottom-flow full-width"
    });

    return content;
  };

  var createDropDown = function (parent, labelText, section, feature, options) {
    var container = $.CreatePanel('Panel', parent, '', {
      class: "SettingsMenuDropdownContainer"
    });

    $.CreatePanel('Label', container, '', {
      class: "half-width",
      text: labelText
    });

    var dropdown = $.CreatePanel('CSGOSettingsEnumDropDown', container, feature, {
      class: "PopupButton White",
      oninputsubmit: `$.Osiris.dropDownUpdated('${section}', '${feature}');`
    });

    for (let i = 0; i < options.length; ++i) {
      dropdown.AddOption($.CreatePanel('Label', dropdown, i, {
        value: i,
        text: options[i]
      }));
    }
  };

  var createOnOffDropDown = function (parent, labelText, section, feature) {
    createDropDown(parent, labelText, section, feature, ["开", "关"]);
  };

  var createYesNoDropDown = function (parent, labelText, section, feature) {
    createDropDown(parent, labelText, section, feature, ["是", "否"]);
  };

  var separator = function (parent) {
    $.CreatePanel('Panel', parent, '', { class: "horizontal-separator" });
  };

  var makeFauxItemId = function (defIndex, paintKitId) {
    return (BigInt(0xF000000000000000) | BigInt(paintKitId << 16) | BigInt(defIndex))
  };

  var createPlayerModelGlowPreview = function (parent, id, labelId, playerModel, itemId) {
    var container = $.CreatePanel('Panel', parent, '', { style: 'flow-children: none;' });
    var previewPanel = $.CreatePanel('MapPlayerPreviewPanel', container, id, {
      map: "ui/buy_menu",
      camera: "cam_loadoutmenu_ct",
      "require-composition-layer": true,
      playermodel: playerModel,
      playername: "vanity_character",
      animgraphcharactermode: "buy-menu",
      player: true,
      mouse_rotate: false,
      sync_spawn_addons: true,
      "transparent-background": true,
      "pin-fov": "vertical",
      csm_split_plane0_distance_override: "250.0",
      style: "y: 5px; vertical-align: top; width: 300px; height: 300px; horizontal-align: center;"
    });
    previewPanel.EquipPlayerWithItem(itemId);
    $.CreatePanel('Label', container, labelId, { style: 'vertical-align: top; horizontal-align: center;' });
  };

  var createGrenadeModelGlowPreview = function (parent, id, defIndex) {
    var container = $.CreatePanel('Panel', parent, '', { style: 'width: 80px; overflow: clip;' });
    var panel = $.CreatePanel('MapItemPreviewPanel', container, id, {
      map: "ui/xpshop_item",
      camera: "camera_weapon_4",
      "require-composition-layer": true,
      player: false,
      initial_entity: "item",
      mouse_rotate: false,
      sync_spawn_addons: true,
      "transparent-background": true,
      "pin-fov": "vertical",
      style: "x: -10px; horizontal-align: center; width: 200px; height: 80px;"
    });
    panel.SetItemItemId(makeFauxItemId(defIndex, 0), {});
  };
)"
// split the string literal because MSVC does not support string literals longer than 16k chars - error C2026
u8R"(
  var hud = createTab('hud');

  var bomb = createSection(hud, '炸弹');
  createYesNoDropDown(bomb, "显示炸弹爆炸倒计时和包点", 'hud', 'bomb_timer');
  separator(bomb);
  createYesNoDropDown(bomb, "显示炸弹拆除倒计时", 'hud', 'defusing_alert');

  var killfeed = createSection(hud, '击杀信息');
  separator(killfeed);
  createYesNoDropDown(killfeed, "保留回合击杀信息", 'hud', 'preserve_killfeed');

  var time = createSection(hud, '计时器');
  separator(time);
  createYesNoDropDown(time, "显示回合后计时器", 'hud', 'postround_timer');

  var visuals = createVisualsTab();

  var playerInfoTab = createSubTab(visuals, 'player_info');

  var playerInfo = createSection(playerInfoTab, '玩家信息');
  createDropDown(playerInfo, "主开关", 'visuals', 'player_information_through_walls', ['仅敌人', '所有人', '关']);

  var playerPosition = createSection(playerInfoTab, '玩家位置');
  createYesNoDropDown(playerPosition, "显示玩家位置箭头", 'visuals', 'player_info_position');
  separator(playerPosition);
  createDropDown(playerPosition, "颜色", 'visuals', 'player_info_position_color', ['玩家颜色', '队伍颜色']);

  var playerHealth = createSection(playerInfoTab, '玩家血量');
  createYesNoDropDown(playerHealth, "显示玩家血量", 'visuals', 'player_info_health');
  separator(playerHealth);
  createDropDown(playerHealth, "颜色", 'visuals', 'player_info_health_color', ['随血量变化', '白色']);

  var playerWeapon = createSection(playerInfoTab, '玩家枪械');
  createYesNoDropDown(playerWeapon, "显示玩家当前手持武器", 'visuals', 'player_info_weapon');
  separator(playerWeapon);
  createYesNoDropDown(playerWeapon, "显示玩家当前手持武器子弹数", 'visuals', 'player_info_weapon_clip');
  separator(playerWeapon);
  createYesNoDropDown(playerWeapon, '显示包匪', 'visuals', 'player_info_bomb_carrier');
  separator(playerWeapon);
  createYesNoDropDown(playerWeapon, '显示正在放置炸弹图标', 'visuals', 'player_info_bomb_planting');

  var playerIcons = createSection(playerInfoTab, '图标');
  createYesNoDropDown(playerIcons, "显示正在拆弹图标", 'visuals', 'player_info_defuse');
  separator(playerIcons);
  createYesNoDropDown(playerIcons, '显示接走人质图标', 'visuals', 'player_info_hostage_pickup');
  separator(playerIcons);
  createYesNoDropDown(playerIcons, '显示解救人质图标', 'visuals', 'player_info_hostage_rescue');
  separator(playerIcons);
  createYesNoDropDown(playerIcons, '显示闪光弹致盲图标', 'visuals', 'player_info_blinded');

  var outlineGlowTab = createSubTab(visuals, 'outline_glow');

  var outlineGlow = createSection(outlineGlowTab, '轮廓发光');
  createOnOffDropDown(outlineGlow, "总开关", 'visuals', 'outline_glow_enable');

  var playerOutlineGlow = createSection(outlineGlowTab, '玩家');
  createDropDown(playerOutlineGlow, "轮廓显示", 'visuals', 'player_outline_glow', ['仅敌人', '所有人', '关']);
  separator(playerOutlineGlow);
  createDropDown(playerOutlineGlow, "颜色", 'visuals', 'player_outline_glow_color', ['玩家颜色', '队伍颜色', '随血量变化']);

  var weaponOutlineGlow = createSection(outlineGlowTab, '武器');
  createYesNoDropDown(weaponOutlineGlow, "显示附近地面上的武器", 'visuals', 'weapon_outline_glow');
  separator(weaponOutlineGlow);
  createYesNoDropDown(weaponOutlineGlow, "显示道具", 'visuals', 'grenade_proj_outline_glow');

  var bombAndDefuseKitOutlineGlow = createSection(outlineGlowTab, '炸弹与拆弹器');
  createYesNoDropDown(bombAndDefuseKitOutlineGlow, "显示地上的炸弹位置", 'visuals', 'dropped_bomb_outline_glow');
  separator(bombAndDefuseKitOutlineGlow);
  createYesNoDropDown(bombAndDefuseKitOutlineGlow, "Glow Ticking Bomb", 'visuals', 'ticking_bomb_outline_glow');
  separator(bombAndDefuseKitOutlineGlow);
  createYesNoDropDown(bombAndDefuseKitOutlineGlow, "显示附近地上的拆弹器", 'visuals', 'defuse_kit_outline_glow');

  var hostageOutlineGlow = createSection(outlineGlowTab, '人质');
  createYesNoDropDown(hostageOutlineGlow, "显示人质", 'visuals', 'hostage_outline_glow');

  var _modelGlowTab = createSubTab(visuals, 'model_glow');
  _modelGlowTab.style.flowChildren = 'right';

  var modelGlowPreview = $.CreatePanel('Panel', _modelGlowTab, '', { style: 'flow-children: down;' });
  $.CreatePanel('Label', modelGlowPreview, '', { style: 'vertical-align: top; horizontal-align: center; font-size: 40;', text: '预览' });
  var playerModelGlowPreview = $.CreatePanel('Panel', modelGlowPreview, '', { style: 'flow-children: right; margin-top: 20px;' });
  createPlayerModelGlowPreview(playerModelGlowPreview, 'ModelGlowPreviewPlayerTT', 'ModelGlowPreviewPlayerTTLabel', 'characters/models/tm_professional/tm_professional_varf.vmdl', makeFauxItemId(7, 921));
  createPlayerModelGlowPreview(playerModelGlowPreview, 'ModelGlowPreviewPlayerCT', 'ModelGlowPreviewPlayerCTLabel', 'characters/models/ctm_st6/ctm_st6_variante.vmdl', makeFauxItemId(9, 819));

  $.CreatePanel('Label', modelGlowPreview, '', { style: 'horizontal-align: center; margin-top: 20px;', text: '地上的武器' });

  var weaponModelGlowPreview = $.CreatePanel('Panel', modelGlowPreview, '', { style: 'flow-children: right;' });

  var modelGlowPreviewWeapon = $.CreatePanel('MapItemPreviewPanel', weaponModelGlowPreview, 'ModelGlowPreviewWeapon', {
    map: "ui/xpshop_item",
    camera: "camera_weapon_0",
    "require-composition-layer": true,
    player: false,
    initial_entity: "item",
    mouse_rotate: false,
    sync_spawn_addons: true,
    "transparent-background": true,
    "pin-fov": "vertical",
    style: "width: 400px; height: 160px;"
  });
  modelGlowPreviewWeapon.SetItemItemId(makeFauxItemId(16, 255), {});

  var grenadeModelGlowPreview = $.CreatePanel('Panel', weaponModelGlowPreview, '', { style: 'flow-children: down;' });

  var grenadeModelGlowPreviewRow1 = $.CreatePanel('Panel', grenadeModelGlowPreview, '', { style: 'flow-children: right;' });
  createGrenadeModelGlowPreview(grenadeModelGlowPreviewRow1, 'ModelGlowPreviewFlashbang', 43);
  createGrenadeModelGlowPreview(grenadeModelGlowPreviewRow1, 'ModelGlowPreviewHEGrenade', 44);

  var grenadeModelGlowPreviewRow2 = $.CreatePanel('Panel', grenadeModelGlowPreview, '', { style: 'flow-children: right;' });
  createGrenadeModelGlowPreview(grenadeModelGlowPreviewRow2, 'ModelGlowPreviewSmoke', 45);
  createGrenadeModelGlowPreview(grenadeModelGlowPreviewRow2, 'ModelGlowPreviewIncendiary', 48);

  var modelGlowTab = $.CreatePanel('Panel', _modelGlowTab, '', { style: 'flow-children: down;' });

  var modelGlow = createSection(modelGlowTab, '模型发光');
  createOnOffDropDown(modelGlow, "总开关", 'visuals', 'model_glow_enable');

  var playerModelGlow = createSection(modelGlowTab, '玩家');
  createDropDown(playerModelGlow, "玩家模型发光", 'visuals', 'player_model_glow', ['仅敌人', '所有人', '关']);
  separator(playerModelGlow);
  createDropDown(playerModelGlow, "颜色", 'visuals', 'player_model_glow_color', ['玩家颜色', '队伍颜色', '随血量变化', '敌人/盟友']);

  var weaponModelGlow = createSection(modelGlowTab, '武器');
  createYesNoDropDown(weaponModelGlow, "地上的武器模型发光", 'visuals', 'weapon_model_glow');
  separator(weaponModelGlow);
  createYesNoDropDown(weaponModelGlow, "道具模型发光", 'visuals', 'grenade_proj_model_glow');

  var bombModelGlow = createSection(modelGlowTab, '炸弹与拆弹器');
  createYesNoDropDown(bombModelGlow, "地上的炸弹发光", 'visuals', 'dropped_bomb_model_glow');
  separator(bombModelGlow);
  createYesNoDropDown(bombModelGlow, "Glow Ticking Bomb Model", 'visuals', 'ticking_bomb_model_glow');
  separator(bombModelGlow);
  createYesNoDropDown(bombModelGlow, "地上的拆弹器发光", 'visuals', 'defuse_kit_model_glow');

  $.Osiris.navigateToSubTab('visuals', 'player_info');

  var sound = createTab('sound');

  var playerSoundVisualization = createSection(sound, '播放器声音可视化');
  separator(playerSoundVisualization);
  createYesNoDropDown(playerSoundVisualization, "可视化玩家脚步声", 'sound', 'visualize_player_footsteps');

  var bombSoundVisualization = createSection(sound, '炸弹声音可视化');
  createYesNoDropDown(bombSoundVisualization, "下包声音可视化", 'sound', 'visualize_bomb_plant');
  separator(bombSoundVisualization);
  createYesNoDropDown(bombSoundVisualization, "炸弹哔哔声可视化", 'sound', 'visualize_bomb_beep');
  separator(bombSoundVisualization);
  createYesNoDropDown(bombSoundVisualization, "拆弹声音可视化", 'sound', 'visualize_bomb_defuse');

  var weaponSoundVisualization = createSection(sound, '武器声音可视化');
  createYesNoDropDown(weaponSoundVisualization, "可视化武器瞄准镜声音", 'sound', 'visualize_scope_sound');
  separator(weaponSoundVisualization);
  createYesNoDropDown(weaponSoundVisualization, "可视化武器装填声音", 'sound', 'visualize_reload_sound');

  $.Osiris.navigateToTab('hud');
})();
)"
