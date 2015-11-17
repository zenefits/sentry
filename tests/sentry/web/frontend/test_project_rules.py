from __future__ import absolute_import, print_function

from django.core.urlresolvers import reverse
from exam import fixture

from sentry.testutils import TestCase


class ProjectRuleTest(TestCase):
    @fixture
    def path(self):
        return reverse('sentry-project-rules', args=[self.organization.slug, self.project.slug])

    def test_requires_authentication(self):
        self.assertRequiresAuthentication(self.path)

    def test_simple(self):
        self.login_as(self.user)

        resp = self.client.get(self.path)
        assert resp.status_code == 200
        self.assertTemplateUsed('sentry/projects/rules/list.html')
        assert resp.context['organization'] == self.organization
        assert resp.context['team'] == self.team
        assert resp.context['project'] == self.project
        assert resp.context['rule_list']
