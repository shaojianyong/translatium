/* global remote */
import React from 'react';
import PropTypes from 'prop-types';

import { MenuItem } from 'material-ui/Menu';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Switch from 'material-ui/Switch';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import connectComponent from '../../helpers/connect-component';

import EnhancedMenu from '../enhanced-menu';

import { toggleSetting, updateSetting } from '../../state/root/settings/actions';
import { updateStrings } from '../../state/root/strings/actions';
import { openShortcutDialog } from '../../state/pages/settings/shortcut-dialog/actions';

import colorPairs from '../../constants/colors';
import displayLanguages from '../../constants/display-languages';

import getPlatform from '../../helpers/get-platform';
import openUri from '../../helpers/open-uri';

import { runApp } from '../..';

import DialogShortcut from './dialog-shortcut';

const styles = theme => ({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    boxSizing: 'border-box',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  paperTitle: {
    width: '100%',
    maxWidth: 720,
    margin: '0 auto',
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: 4,
    paddingLeft: 16,
    fontSize: 15,
    '&:not(:first-child)': {
      marginTop: 36,
    },
  },
  paper: {
    maxWidth: 720,
    margin: '0 auto',
  },
  shortcutKey: {
    lineHeight: '48px',
    padding: '0 16px',
    fontSize: 15,
    color: theme.palette.text.secondary,
  },
});

const renderCombinator = combinator =>
  combinator
    .replace(/\+/g, ' + ')
    .replace('alt', getPlatform() === 'windows' ? 'alt' : '⌥')
    .replace('shift', getPlatform() === 'windows' ? 'shift' : '⇧')
    .replace('mod', getPlatform() === 'windows' ? 'ctrl' : '⌘')
    .replace('meta', '⌘')
    .toUpperCase();

const dockAndMenubarOpts = [
  'showOnBothDockAndMenubar',
  'onlyShowOnDock',
  'onlyShowOnMenubar',
];

const Settings = (props) => {
  const {
    chinaMode,
    classes,
    darkMode,
    dockAndMenubar,
    langId,
    onOpenShortcutDialog,
    onSettingChange,
    onToggle,
    onUpdateStrings,
    preventScreenLock,
    primaryColorId,
    realtime,
    strings,
    translateWhenPressingEnter,

    cameraShortcut,
    clearInputShortcut,
    drawShortcut,
    listenShortcut,
    openImageFileShortcut,
    openInputLangListShortcut,
    openOnMenubarShortcut,
    openOutputLangListShortcut,
    saveToPhrasebookShortcut,
    speakShorcut,
    swapLanguagesShortcut,
  } = props;

  const shortcuts = [
    { identifier: 'openInputLangList', combinator: openInputLangListShortcut },
    { identifier: 'openOutputLangList', combinator: openOutputLangListShortcut },
    { identifier: 'swapLanguages', combinator: swapLanguagesShortcut },
    { identifier: 'clearInput', combinator: clearInputShortcut },
    { identifier: 'openImageFile', combinator: openImageFileShortcut },
    { identifier: 'saveToPhrasebook', combinator: saveToPhrasebookShortcut },
    { identifier: 'speak', combinator: speakShorcut },
    { identifier: 'listen', combinator: listenShortcut },
    { identifier: 'draw', combinator: drawShortcut },
  ];
  if (getPlatform() !== 'electron') {
    shortcuts.push({ identifier: 'camera', combinator: cameraShortcut });
  }
  if (getPlatform() === 'electron'
    && ['showOnBothDockAndMenubar', 'onlyShowOnMenubar'].indexOf(dockAndMenubar) > -1) {
    shortcuts.unshift(
      { identifier: 'openOnMenubar', combinator: openOnMenubarShortcut },
    );
  }

  return (
    <div className={classes.container}>
      <DialogShortcut />
      <AppBar position="static">
        <Toolbar>
          <Typography type="title" color="inherit">{strings.settings}</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.innerContainer}>
        <Typography type="body2" className={classes.paperTitle}>
          {strings.appearance}
        </Typography>
        <Paper className={classes.paper}>
          <List>
            <ListItem>
              <ListItemText
                primary={strings.primaryColor}
                secondary={strings[primaryColorId]}
              />
              <ListItemSecondaryAction>
                <EnhancedMenu
                  id="changeColor"
                  buttonElement={(
                    <Button raised color="primary">
                      {strings.change}
                    </Button>
                  )}
                >
                  {Object.keys(colorPairs).map(colorId => (
                    <MenuItem
                      key={`color_${colorId}`}
                      value={colorId}
                      onClick={() => {
                        onSettingChange('primaryColorId', colorId);
                        runApp(true);
                      }}
                    >
                      {strings[colorId]}
                    </MenuItem>
                  ))}
                </EnhancedMenu>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary={strings.displayLanguage}
                secondary={displayLanguages[langId].displayName}
              />
              <ListItemSecondaryAction>
                <EnhancedMenu
                  id="changeDisplayLanguage"
                  buttonElement={(
                    <Button>
                      {strings.change}
                    </Button>
                  )}
                >
                  {Object.keys(displayLanguages).map(lId => (
                    <MenuItem
                      key={`lang_${lId}`}
                      value={lId}
                      onClick={() => {
                        if (lId !== langId) {
                          onSettingChange('langId', lId);
                          onUpdateStrings(lId);
                        }
                      }}
                    >
                      {displayLanguages[lId].displayName}
                    </MenuItem>
                  ))}
                </EnhancedMenu>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary={strings.darkMode} />
              <ListItemSecondaryAction>
                <Switch
                  checked={darkMode}
                  onChange={() => {
                    onToggle('darkMode');
                    runApp(true);
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>


        {getPlatform() === 'electron' && (
          <Typography type="body2" className={classes.paperTitle}>
            {strings.dockAndMenubar}
          </Typography>
        )}
        {getPlatform() === 'electron' && (
          <Paper className={classes.paper}>
            <List>
              <ListItem>
                <ListItemText
                  primary={`${strings.dockAndMenubar} (${strings.restartRequired})`}
                  secondary={strings[dockAndMenubar]}
                />
                <ListItemSecondaryAction>
                  <EnhancedMenu
                    id="changeDockMenubar"
                    buttonElement={(
                      <Button>
                        {strings.change}
                      </Button>
                    )}
                  >
                    {dockAndMenubarOpts.map(opts => (
                      <MenuItem
                        key={`dockAndMenubarOpts_${opts}`}
                        value={opts}
                        onClick={() => {
                          onSettingChange('dockAndMenubar', opts);
                        }}
                      >
                        {strings[opts]}
                      </MenuItem>
                    ))}
                  </EnhancedMenu>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        )}

        <Typography type="body2" className={classes.paperTitle}>
          {strings.advanced}
        </Typography>
        <Paper className={classes.paper}>
          <List>
            <ListItem>
              <ListItemText primary={strings.realtime} />
              <ListItemSecondaryAction>
                <Switch
                  checked={realtime}
                  onChange={() => onToggle('realtime')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            {getPlatform() === 'windows' && (
              <ListItem>
                <ListItemText primary={strings.preventScreenLock} />
                <ListItemSecondaryAction>
                  <Switch
                    checked={preventScreenLock}
                    onChange={() => onToggle('preventScreenLock')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            )}
            <ListItem>
              <ListItemText primary={strings.translateWhenPressingEnter} />
              <ListItemSecondaryAction>
                <Switch
                  checked={translateWhenPressingEnter}
                  onChange={() => onToggle('translateWhenPressingEnter')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary={strings.chinaMode}
                secondary={strings.chinaModeDesc}
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={chinaMode}
                  onChange={() => onToggle('chinaMode')}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        <Typography type="body2" className={classes.paperTitle}>
          {strings.shortcuts}
        </Typography>
        <Paper className={classes.paper}>
          <List>
            {shortcuts.map(({ identifier, combinator }) => (
              <ListItem
                button
                key={identifier}
                onClick={() => onOpenShortcutDialog(identifier, combinator)}
              >
                <ListItemText
                  primary={strings[identifier]}
                  secondary={renderCombinator(combinator)}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    className={classes.button}
                    aria-label={strings.change}
                    onClick={() => onOpenShortcutDialog(identifier, combinator)}
                  >
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Typography type="body2" className={classes.paperTitle}>
          {strings.about}
        </Typography>
        <Paper className={classes.paper}>
          <List>
            {getPlatform() === 'windows' && (
              <ListItem button onClick={() => openUri('ms-windows-store://review/?ProductId=9wzdncrcsg9k')} role="link">
                <ListItemText primary={strings.rateWindowsStore} />
              </ListItem>
            )}
            {getPlatform() === 'electron' && (
              <ListItem button onClick={() => openUri('macappstore://itunes.apple.com/app/id1176624652?mt=12')} role="link">
                <ListItemText primary={strings.rateMacAppStore} />
              </ListItem>
            )}
            <ListItem button onClick={() => openUri('https://translatiumapp.com/support')} role="link">
              <ListItemText primary={strings.help} />
            </ListItem>
            <ListItem button onClick={() => openUri('mailto:support@translatiumapp.com')} role="link">
              <ListItemText primary={strings.sendFeedback} />
            </ListItem>
            <ListItem button onClick={() => openUri('https://translatiumapp.com')} role="link">
              <ListItemText primary={strings.website} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Version" secondary={process.env.REACT_APP_VERSION} />
            </ListItem>
          </List>
        </Paper>

        {getPlatform() === 'electron' && (
          <Typography type="body2" className={classes.paperTitle}>
            {strings.quit}
          </Typography>
        )}
        {getPlatform() === 'electron' && (
          <Paper className={classes.paper}>
            <List>
              <ListItem button>
                <ListItemText primary={strings.quit} onClick={() => remote.app.quit()} />
              </ListItem>
            </List>
          </Paper>
        )}
      </div>
    </div>
  );
};

Settings.propTypes = {
  chinaMode: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  darkMode: PropTypes.bool.isRequired,
  dockAndMenubar: PropTypes.oneOf(dockAndMenubarOpts).isRequired,
  langId: PropTypes.string.isRequired,
  onOpenShortcutDialog: PropTypes.func.isRequired,
  onSettingChange: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onUpdateStrings: PropTypes.func.isRequired,
  preventScreenLock: PropTypes.bool.isRequired,
  primaryColorId: PropTypes.string.isRequired,
  realtime: PropTypes.bool.isRequired,
  strings: PropTypes.objectOf(PropTypes.string).isRequired,
  translateWhenPressingEnter: PropTypes.bool.isRequired,

  cameraShortcut: PropTypes.string.isRequired,
  clearInputShortcut: PropTypes.string.isRequired,
  drawShortcut: PropTypes.string.isRequired,
  listenShortcut: PropTypes.string.isRequired,
  openImageFileShortcut: PropTypes.string.isRequired,
  openInputLangListShortcut: PropTypes.string.isRequired,
  openOnMenubarShortcut: PropTypes.string.isRequired,
  openOutputLangListShortcut: PropTypes.string.isRequired,
  saveToPhrasebookShortcut: PropTypes.string.isRequired,
  speakShorcut: PropTypes.string.isRequired,
  swapLanguagesShortcut: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  chinaMode: state.settings.chinaMode,
  darkMode: state.settings.darkMode,
  dockAndMenubar: state.settings.dockAndMenubar,
  langId: state.settings.langId,
  preventScreenLock: state.settings.preventScreenLock,
  primaryColorId: state.settings.primaryColorId,
  realtime: state.settings.realtime,
  strings: state.strings,
  translateWhenPressingEnter: state.settings.translateWhenPressingEnter,

  cameraShortcut: state.settings.cameraShortcut,
  clearInputShortcut: state.settings.clearInputShortcut,
  drawShortcut: state.settings.drawShortcut,
  listenShortcut: state.settings.listenShortcut,
  openImageFileShortcut: state.settings.openImageFileShortcut,
  openInputLangListShortcut: state.settings.openInputLangListShortcut,
  openOnMenubarShortcut: state.settings.openOnMenubarShortcut,
  openOutputLangListShortcut: state.settings.openOutputLangListShortcut,
  saveToPhrasebookShortcut: state.settings.saveToPhrasebookShortcut,
  speakShorcut: state.settings.speakShorcut,
  swapLanguagesShortcut: state.settings.swapLanguagesShortcut,
});

const mapDispatchToProps = dispatch => ({
  onToggle: name => dispatch(toggleSetting(name)),
  onSettingChange: (name, value) => dispatch(updateSetting(name, value)),
  onUpdateStrings: langId => dispatch(updateStrings(langId)),
  onOpenShortcutDialog: (identifier, combinator) =>
    dispatch(openShortcutDialog(identifier, combinator)),
});

export default connectComponent(
  Settings,
  mapStateToProps,
  mapDispatchToProps,
  styles,
);
