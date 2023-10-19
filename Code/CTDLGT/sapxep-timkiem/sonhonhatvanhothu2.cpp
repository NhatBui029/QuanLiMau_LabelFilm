#include<bits/stdc++.h>
using namespace std;

int main(){
    int t;
    cin>>t;
    while(t--){
        int n;
        cin>>n;
        long a[n+5];
        for(int i=0;i<n;i++) cin>>a[i];
        set<long> st;
        for(int i=0;i<n;i++) st.insert(a[i]);
        set<long>::iterator it;
        if(st.size()==1) cout<<-1<<endl;
        else {
            int dem=0;
            for(it=st.begin();it!=st.end();it++){
                cout<<*it<<" ";
                dem++;
                if(dem==2) break;
            }
            cout<<endl;
        }
    }
}
