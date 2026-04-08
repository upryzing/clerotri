import {
  type Dispatch,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import {observer} from 'mobx-react-lite';

import {Member, Server} from 'revolt.js';

import {app} from '@clerotri/Generic';
import {BackButton} from '@clerotri/components/common/atoms';
import {
  MemberList,
  MemberSettings,
  SelectionContext,
} from '@clerotri/components/common/settings/sections/server/member';
import type {SettingsSection} from '@clerotri/lib/types';

export const MemberSettingsSection = observer(
  ({
    server,
    section,
    setSection,
  }: {
    server: Server;
    section: SettingsSection;
    setSection: Dispatch<SetStateAction<SettingsSection>>;
  }) => {
    const [currentMember, setCurrentMember] = useState<Member | null>(null);

    // check once if the subsection is set when opening the settings section
    useEffect(() => {
      async function fetchMemberFromSubsection() {
        if (section?.subsection) {
          const member = await server.fetchMember(
            section.subsection.replace('member-', '').replace('-roles', ''),
          );
          setCurrentMember(member);
        }
      }
      fetchMemberFromSubsection();

      // this only runs once and we don't want it to rerun when the dependencies change, so...
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setSectionAndMember = (member: Member) => {
      setCurrentMember(member);
      setSection({section: 'members', subsection: `member-${member._id.user}`});
    };

    const handleBackInSubsection = () => {
      if (section?.subsection?.endsWith('-roles')) {
        setSection({
          section: 'members',
          subsection: section.subsection.replace('-roles', ''),
        });
        return;
      }
      setCurrentMember(null);
      setSection({section: 'members', subsection: undefined});
    };

    const onKickOrBan = (
      member: Member,
      action: 'kick' | 'ban',
      reason: string,
    ) => {
      console.log(member._id.user, action, reason);
      handleBackInSubsection();
      app.openModActionModal(null);
      if (action === 'kick') {
        member.kick();
      } else {
        server.banUser(member._id.user, {reason: reason});
      }
    };

    const {selectionMode, setSelectionMode} = useContext(SelectionContext);

    return (
      <>
        <BackButton
          callback={() => {
            selectionMode
              ? setSelectionMode(false)
              : section!.subsection
                ? handleBackInSubsection()
                : setSection(null);
          }}
          margin
        />
        {section?.subsection?.startsWith('member') && currentMember ? (
          <MemberSettings
            server={server}
            member={currentMember}
            onKickOrBan={onKickOrBan}
            section={section}
            setSection={setSection}
          />
        ) : (
          <MemberList server={server} setMember={setSectionAndMember} />
        )}
      </>
    );
  },
);
